const state = {
    onLoad: false,
}

const url = new URL(location.href)

const loaderSVG = () => `
    <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 128 128">
        <g>
            <linearGradient id="linear-gradient">
                <stop offset="0%" stop-color="#000"/>
                <stop offset="100%" stop-color="#0090fe"/>
            </linearGradient>
            <linearGradient id="linear-gradient2">
                <stop offset="0%" stop-color="#000"/>
                <stop offset="100%" stop-color="#90e6fe"/>
            </linearGradient>
            <path d="M64 .98A63.02 63.02 0 1 1 .98 64 63.02 63.02 0 0 1 64 .98zm0 15.76A47.26 47.26 0 1 1 16.74 64 47.26 47.26 0 0 1 64 16.74z" fill-rule="evenodd" fill="url(#linear-gradient)"/>
            <path d="M64.12 125.54A61.54 61.54 0 1 1 125.66 64a61.54 61.54 0 0 1-61.54 61.54zm0-121.1A59.57 59.57 0 1 0 123.7 64 59.57 59.57 0 0 0 64.1 4.43zM64 115.56a51.7 51.7 0 1 1 51.7-51.7 51.7 51.7 0 0 1-51.7 51.7zM64 14.4a49.48 49.48 0 1 0 49.48 49.48A49.48 49.48 0 0 0 64 14.4z" fill-rule="evenodd" fill="url(#linear-gradient2)"/>
            <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform>
        </g>
    </svg>
`;

const progressBar = () => `
        <div style="position: fixed;height: 30px;width: 100%;top: 0;display: flex;justify-content: center;align-items: center">
            <div
                id="progressbar"
                style="height: 12px;width: 90%;border-radius: 12px;display: none;align-items: center;background-color: #3495c5;padding: 0 2px"
            >
                <div id="progress-line" style="background-color: #1f4b60;transition: 0.3s width;width: 60%;height: 8px;border-radius: 8px"></div>
            </div>
        </div>`;

const backdrop = () => {
    const backdrop = document.createElement('div');
    backdrop.style.position = "fixed";
    backdrop.style.top = "0";
    backdrop.style.width = "100%";
    backdrop.style.height = "100vh";
    backdrop.style.backgroundColor = "#0003";
    backdrop.style.display = "none";
    backdrop.style.alignItems = "center";
    backdrop.style.justifyContent = "center";
    document.body.insertAdjacentElement('beforeend', backdrop);

    backdrop.insertAdjacentHTML('beforeend', loaderSVG());
    backdrop.insertAdjacentHTML('beforeend', progressBar());

    return backdrop;
}

const loader = backdrop();

const showLoader = () => {
    if (loader.style.display !== "flex") {
        loader.style.display = "flex";
    }
}

const hideLoader = () => {
    if (loader.style.display !== "none") {
        loader.style.display = "none";
    }
}

const showProgressbar = (progress) => {
    const progressbar = loader.querySelector('#progressbar')
    progressbar.querySelector('#progress-line').style.width = progress + '%'

    if (progressbar.style.display !== "flex") {
        progressbar.style.display = "flex";
    }

    showLoader()
}

const hideProgressbar = () => {
    const progressbar = loader.querySelector('#progressbar')
    progressbar.querySelector('#progress-line').style.width = 0 + '%'
    if (progressbar.style.display !== "none") {
        progressbar.style.display = "none";
    }

    hideLoader()
}

chrome.runtime.sendMessage({action: 'get-state', payload: 'content'}, function (res) {
    if (res) {
        Object.assign(state, res);
        state.onLoad = true;
        resetRefresh();
    } else {
        refresh();
    }
});

chrome.storage.onChanged.addListener(async function (changes) {

    for (const prop in changes) {
        state[prop] = {...changes[prop].newValue};
    }

    if (
        (changes.hasOwnProperty('global') && !changes.global.newValue?.run && changes.global.oldValue?.run) || (
            state.global.run &&
            (
                (changes.hasOwnProperty('global') && !changes.global.newValue.isRefresh) ||
                (url.pathname === pathNames.inventory && changes.hasOwnProperty('inventory_actions')) ||
                (url.pathname === pathNames.parcels && changes.hasOwnProperty('parcels')) ||
                (url.pathname === pathNames.battles && changes.hasOwnProperty('battles')) ||
                (url.pathname === pathNames.world && changes.hasOwnProperty('world')) ||
                (url.pathname === pathNames.castle && changes.hasOwnProperty('castle')) ||
                (url.pathname === pathNames.workshop && changes.hasOwnProperty('workshop')) ||
                (url.pathname === pathNames.resources && changes.hasOwnProperty('extract') && changes.extract.newValue.run !== changes.extract.oldValue.run) ||
                (url.pathname === pathNames.resources && changes.hasOwnProperty('extract') && changes.extract.newValue.type !== changes.extract.oldValue.type) ||
                (changes.hasOwnProperty('battlefield'))
            )
        )
    ) {
        setTimeout(refresh, delay.long);
    }

    if (changes.global && (+changes.global.newValue.captcha >= state.captcha.capMonster.value)) {
        setBadge('$', '#ecaa15');
    }
    if (changes.global && (+changes.global.newValue.captcha < state.captcha.capMonster.value)) {
        setBadge('');
    }

    if (!state.global.run) {
        // если бот вырублен, то нет смысла обрабатывать изменения ниже...
        return;
    }

    if (url.pathname === pathNames.inventory && changes.hasOwnProperty('inventory_filters')) {
        runFilter();
    }

    if (url.pathname !== pathNames.world && changes.hasOwnProperty('world') && +changes.world.newValue.map !== 0 && +changes.world.oldValue.map === 0) {
        await beforeMapAction(+changes.world.newValue.map);
        url.searchParams.set('map_filter', '1');
        window.location.href = `${url.origin}${pathNames.world}${url.search}`;
    }

    if (changes.hasOwnProperty('world') && +changes.world.newValue.map === 0 && +changes.world.oldValue.map !== 0) {
        await afterMapAction(+changes.world.oldValue.map);
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "scan-folders":
            scanFolders()
                .then(folders => {
                    sendResponse({folders: folders})
                });
            return true;
        case "scan-skills":
            scanSkills()
                .then(skillList => {
                    sendResponse({skills: skillList})
                });
            return true;
        case "take-quests":
        case "pass-quests":
            queryQuests(request.payload)
                .then(() => {
                    sendResponse(true)
                });
            return true;
        case "take-buffs":
            takeBuffs(request.payload)
                .then(() => {
                    sendResponse(true)
                });
            return true;
        case "flasks":
            flasksAction(request.payload).then(() => {
                    sendResponse(true)
                });
            return true;
        case "battleground":
            battlegroundActions(request)
                .then(() => {
                    sendResponse(true)
                });
            return true;
        case "get-captcha":
            sendResponse({captcha: captcha});
            return true;
        case "break-items":
            breakItems(request.payload).then(() => {
                sendResponse(true)
            });
            return true;
        case "refresh":
            getInfo()
                .then(() => {
                    refresh();
                    sendResponse({text: messages.installed});
                })
            return true;
        default:
            return true;
    }
});

async function beforeMapAction(map) {
    if (map === 7) {
        return await queryQuests({ids: quests.arena, key: 'get'});
    }
    return await Promise.resolve();
}

async function afterMapAction(map) {
    if (map === 7) {
        return await queryQuests({ids: quests.arena, key: 'end'});
    }
    return await Promise.resolve();
}

function updateState(payload, type = 'update') {
    chrome.runtime.sendMessage({action: 'set-state', type, payload});
}

function setBadge(text, color = 'blue') {
    updateState({text, color}, 'badge')
}

const notify = (text, warn = false) => {
    const payload = {text, warn}
    chrome.runtime.sendMessage({action: 'show-message', payload});
}

async function getDressItems() {
    const url = new URL(document.location.href);
    const response = await fetch(`${url.origin}${pathNames.user}${url.search}`);
    if (response.ok) {
        const userPageText = await response.text();
        const el = toHtml(userPageText)
        const div = el.querySelector(".mmain").nextElementSibling;
        const spans = div.querySelectorAll(".block span[class], .block .pad");
        return Array.from(spans)
            .filter(item => /drop_*|art_*/.test(item.className))
            .map(item => {
                const itemUrl = new URL(item.querySelector('a[href*="&i=1&"]').href);
                return itemUrl.searchParams.get('id');
            });
    }
    notify(messages.parseFlasksError, true);
    return [];
}

async function getBreakItems(href) {
    const response = await fetch(href);
    if (response.ok) {
        const forgePageText = await response.text();
        const el = toHtml(forgePageText)
        const form = el.querySelector('form[action^="/forge"]');
        if (form) {
            const options = form.querySelectorAll("option");
            return Array.from(options)
                .map(option => option.value)
        }
        notify(messages.parseEmptyItems);
        return []
    }
    notify(messages.parseForgeError, true);
    return [];
}

const toHtml = (text) => {
    const body = text.replace(/(\r\n|\r|\n)/mg, '').match(/.*<body>(.+)<\/body>.*/)[1];
    const el = document.createElement('DIV');
    el.innerHTML = body;

    return el;
}

async function scanFolders() {
    url.searchParams.set('chest', '1');
    const response = await fetch(`${url.origin}${pathNames.inventory}${url.search}`);
    if (response.ok) {
        const chestPageText = await response.text();
        const el = toHtml(chestPageText)
        const links = el.querySelectorAll('a[href*="chest=1&folder="]');
        const result = [];
        links.forEach(item => {
            const name = item.textContent.trim().replace(/\[\d+]$/, "").trim();
            const id = new URL(item.href).searchParams.get('folder');
            result.push({name, id});
        })
        return result;
    }
}

async function scanSkills() {
    const rankSkills = [
        {name: 'Призыв Рыцаря', id: '184', value: false, group: '0', tooltip: 'Если есть - будет работать'},
        {name: 'Призыв Командора', id: '185', value: false, group: '0', tooltip: 'Если есть - будет работать'},
    ]

    url.searchParams.set('myskills', '1');
    const response = await fetch(`${url.origin}${pathNames.skills}${url.search}`);
    if (response.ok) {
        const skillsPageText = await response.text();
        const el = toHtml(skillsPageText)
        const table = el.querySelector('table');
        if (!table) {
            return {};
        }

        const links = table.querySelectorAll('a[href*="info="]');
        const result = [];
        links.forEach(item => {
            const name = item.textContent.trim();
            const id = new URL(item.href).searchParams.get('info');
            result.push({name, id, value: false, group: '0'});
        })
        return [...result, ...rankSkills];
    }
}

async function queryQuests({ids, key}) {
    showLoader();
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(key, '1');
    searchParams.set('use', '16');

    for (const id of ids) {
        searchParams.set('quest', id);
        await fetch(`${url.origin}${pathNames.leader}?${searchParams.toString()}`);
    }
    hideLoader();
    return true;
}

const takeBuffs = async ({ids}) => {
    showLoader();
    const searchParams = new URLSearchParams(url.search);

    for (const id of ids) {
        searchParams.set('buff', id);
        await fetch(`${url.origin}${pathNames.buff}?${searchParams.toString()}`);
    }
    hideLoader();
    return true;
}

const battlegroundActions = async ({type}) => {
    showLoader();
    const actions = {
        create: 'add_group',
        ready: 'done',
    }

    const searchParams = new URLSearchParams(url.search);
    searchParams.set(actions[type], '1');

    await fetch(`${url.origin}${pathNames.battlefield}?${searchParams.toString()}`);
    hideLoader();

    setTimeout(() => {
        if (url.pathname !== pathNames.battlefield) {
            window.location.href = `${url.origin}${pathNames.battlefield}${url.search}`;
        } else {
            refresh()
        }
    }, delay.fast)

    return true
}

async function breakItems() {
    if (!confirming("Вы уверены, что хотите разбить все предметы?")) {
        return false;
    }

    showLoader()

    const breakUrl = new URL(`${url.origin}${pathNames.forge}`);
    breakUrl.searchParams.set('ex', '1');
    breakUrl.searchParams.set('UIN', url.searchParams.get('UIN'));
    breakUrl.searchParams.set('pass', url.searchParams.get('pass'));

    const ids =  await getBreakItems(breakUrl.href)

    breakUrl.searchParams.set('yes', '1');

    let counter = 0;
    const total = ids.length;

    for (const id of ids) {
        const progress = counter / total * 100
        showProgressbar(progress)
        counter++;

        breakUrl.searchParams.set('id', id);
        await fetch(breakUrl.href);
    }
    hideProgressbar()
    wait()

    return true;
}

async function flasksAction({type}) {
    showLoader();
    const itemsIds = await getDressItems();
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(type, '1');

    let counter = 0;
    const total = itemsIds.length;

    for (const id of itemsIds) {
        const progress = counter / total * 100
        showProgressbar(progress)
        counter++

        searchParams.set('id', id);
        await fetch(`${url.origin}${pathNames.item}?${searchParams.toString()}`);
    }
    hideProgressbar();
    if (url.pathname === pathNames.user) {
        wait();
    }

    return true;
}

async function getInfo() {
    const response = await fetch(`${url.origin}${pathNames.user}${url.search}`);
    if (response.ok) {
        const userPageText = await response.text();
        const city = userPageText.match(/<b>Сейчас в:<\/b> ([А-я]+)/)[1];
        const lvl = userPageText.match(/<b>Уровень:<\/b> ([0-9]+)/)[1];

        state.global.clan_id = userPageText.match(/<b><a href="\/clan\.php\?id=(\d+)/)[1] ?? null;
        updateState({global: state.global});

        return {city, lvl}
    }
}

function wait(sec = 0) {
    state.global.isRefresh = true;
    updateState({global: state.global});
    setTimeout(refresh, sec * 1000);
}

function searchLink(text, element = null) {
    const el = element || document;
    const links = [...el.getElementsByTagName("a")];
    const regEx = new RegExp(text);
    return links.find((e) => regEx.test(e.textContent));
}

function allLinks(text) {
    const links = [...document.getElementsByTagName("a")];
    const regEx = new RegExp(text);
    return links.filter((e) => regEx.test(e.textContent));
}

function checkText(text, element = null) {
    const el = element || document.body;
    const regExp = new RegExp(text);
    return regExp.test(el.innerHTML);
}

function extractText(text) {
    const regExp = new RegExp(text);
    return document.body.innerHTML.match(regExp);
}

function resetRefresh() {
    if (state.global.isRefresh) {
        state.global.isRefresh = false;
        updateState({global: state.global});
    }
}

function refresh() {
    document.location.reload();
}

async function getServiceCaptchaInstance(lvlArg = null) {
    let object;

    if (!lvlArg) {
        const {lvl} = await getInfo();
        lvlArg = lvl;
    }

    switch (state.global.captcha) {
        case "1":
            object = new CaptchaBase(lvlArg)
            break;
        case "2":
            object = new CaptchaCapMonster(lvlArg);
            break;
        case "3":
            object = new CaptchaRuCaptcha(lvlArg);
            break;
        case "4":
            object = new CaptchaAntiCaptcha(lvlArg);
            break;
        default:
            object = null
    }

    return object;
}

async function waitToReadyState() {
    let iteration = 1;

    while (!state.onLoad) {
        if (iteration > 10) {
            refresh();
        } else {
            await new Promise((resolve) => setTimeout(() => {
                iteration++;
                resolve();
            }, 100));
        }
    }
    return state.onLoad;
}

const solve = async () => {
    const instance = await getServiceCaptchaInstance();

    if (!instance) {
        notify(messages.captcha);
        return;
    }

    const img = document.querySelector('img[src*="../caramba.php"]')
    const is_valid = await instance.isBase64UrlImage(img.src)

    if (!is_valid) {
        notify(messages.captcha);
        return;
    }

    instance.getImage(img);
    const localAnswer = instance.checkLocalAnswer();

    if (localAnswer) {
        instance.submitCode(localAnswer);
    } else {
        await instance.createTask();
    }
}

function debug(data, type = null) {
    if (state.global.debug) {
        switch (type) {
            case debugTypes.show:
                alert(data);
                break;
            case debugTypes.copy:
                prompt('Информация:', data);
                break;
            default:
                console.log(data);
                alert('Проверьте консоль, затем нажмите "ОК" и скрипт продолжит работу');
                break;
        }
    }
}

function confirming(text) {
    return window.confirm(text);
}

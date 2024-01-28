const state = {
    onLoad: false,
}

const url = new URL(location.href)

const loaderSVG = () => {
    return `
    <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="100px" height="100px" viewBox="0 0 128 128" xml:space="preserve">
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
}

(function() {
    const backdrop = document.createElement('div');
    backdrop.style.position = "fixed";
    backdrop.style.top = "0";
    backdrop.style.width = "100%";
    backdrop.style.height = "100vh";
    backdrop.style.backgroundColor = "#0003";
    backdrop.style.display = "none";
    backdrop.style.alignItems = "center";
    backdrop.style.justifyContent = "center";
    backdrop.id = "bot-loader";

    backdrop.insertAdjacentHTML('beforeend', loaderSVG());

    document.body.insertAdjacentElement('beforeend', backdrop);
})()

const loader = document.querySelector('#bot-loader');

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
                (changes.hasOwnProperty('global') && !changes.global.newValue.isRefresh)||
                (url.pathname === pathNames.inventory && changes.hasOwnProperty('inventory_actions')) ||
                (url.pathname === pathNames.parcels && changes.hasOwnProperty('parcels')) ||
                (url.pathname === pathNames.battles && changes.hasOwnProperty('battles')) ||
                (url.pathname === pathNames.world && changes.hasOwnProperty('world')) ||
                (url.pathname === pathNames.castle && changes.hasOwnProperty('castle')) ||
                (url.pathname === pathNames.resources && changes.hasOwnProperty('extract') && changes.extract.newValue.run !== changes.extract.oldValue.run) ||
                (url.pathname === pathNames.resources && changes.hasOwnProperty('extract') && changes.extract.newValue.type !== changes.extract.oldValue.type)
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
            flasksAction(request.payload)
                .then(() => {
                    sendResponse(true)
                });
            return true;
        case "get-captcha":
            sendResponse({captcha: captcha});
            return true;
        case "refresh":
            refresh();
            sendResponse({text: messages.installed});
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
        return result;
    }
}

async function queryQuests({ids, key}) {
    showLoader();
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(key, '1');
    searchParams.set('use', '16');

    for (const id of ids) {
        searchParams.set('quest', id);
        await fetch(`${url.origin}${pathNames.quest}?${searchParams.toString()}`);
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

async function flasksAction({type}) {
    showLoader();
    const itemsIds = await getDressItems();
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(type, '1');
    for (const id of itemsIds) {
        searchParams.set('id', id);
        await fetch(`${url.origin}${pathNames.item}?${searchParams.toString()}`);
    }
    hideLoader();

    return true;
}

async function getInfo() {
    const response = await fetch(`${url.origin}${pathNames.user}${url.search}`);
    if (response.ok) {
        const userPageText = await response.text();
        const city = userPageText.match(/<b>Сейчас в:<\/b> ([А-я]+)/)[1];
        const lvl = userPageText.match(/<b>Уровень:<\/b> ([0-9]+)/)[1];
        return {city, lvl}
    }
}

function wait(sec = 0) {
    state.global.isRefresh = true;
    updateState({global: state.global});
    setTimeout(refresh, sec * 1000);
}

function searchLink(text) {
    const links = [...document.getElementsByTagName("a")];
    const regEx = new RegExp(text);
    return links.find((e) => regEx.test(e.textContent));
}

function allLinks(text) {
    const links = [...document.getElementsByTagName("a")];
    const regEx = new RegExp(text);
    return links.filter((e) => regEx.test(e.textContent));
}

function checkText(text) {
    const regExp = new RegExp(text);
    return regExp.test(document.body.innerHTML);
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

function debug(type = null, data) {
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
                break;
        }
    }
}

let state = {}

const url = new URL(location.href)

chrome.runtime.sendMessage({action: 'get-state'}, function (res) {
    Object.assign(state, res);
    resetRefresh();
});


chrome.storage.onChanged.addListener(function (changes) {

    for (const prop in changes) {
        state[prop] = {...changes[prop].newValue};
    }

    if (
        (changes.hasOwnProperty('global') && !changes.global.newValue.run && changes.global.oldValue.run) || (
            state.global.run &&
            (
                changes.hasOwnProperty('global') ||
                (url.pathname === '/inventory.php' && changes.hasOwnProperty('inventory_actions')) ||
                (url.pathname === '/parcels.php' && changes.hasOwnProperty('parcels')) ||
                (url.pathname === '/battle_group.php' && changes.hasOwnProperty('battles')) ||
                (url.pathname === '/world/world.php' && changes.hasOwnProperty('world')) ||
                (url.pathname === '/world/resource.php' && changes.hasOwnProperty('extract') && changes.extract.newValue.run !== changes.extract.oldValue.run) ||
                (url.pathname === '/world/resource.php' && changes.hasOwnProperty('extract') && changes.extract.newValue.type !== changes.extract.oldValue.type)
            )
        )
    ) {
        setTimeout(refresh, delay.long);
    }

    if (!state.global.run) {
        // если бот вырублен, то нет смысла обрабатывать изменения ниже...
        return;
    }

    if (url.pathname === '/inventory.php' && changes.hasOwnProperty('inventory_filters')) {
        runFilter();
    }

    if (url.pathname !== '/world/world.php' && changes.hasOwnProperty('world') && changes.world.newValue.map !== 0 && changes.world.oldValue.map === 0) {
        window.location.href = `${url.origin}/world/world.php${url.search}`;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "scan-folders":
            scanFolders()
                .then(folders => {
                    sendResponse({name: 'folders', value: folders})
                });
            return true;
        case "scan-skills":
            scanSkills()
                .then(skillList => {
                    sendResponse({name: 'skills', value: skillList})
                });
            return true;
        default:
            return true;
    }
});

function updateState(payload, type = 'update') {
    chrome.runtime.sendMessage({action: 'set-state', type, payload});
}

const toHtml = (text) => {
    const body = text.replace(/(\r\n|\r|\n)/mg, '').match(/.*<body>(.+)<\/body>.*/)[1];
    const el = document.createElement('DIV');
    el.innerHTML = body;

    return el;
}

async function scanFolders() {
    url.searchParams.set('chest', '1');
    const response = await fetch(`${url.origin}/inventory.php${url.search}`);
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
    const response = await fetch(`${url.origin}/skill_learn.php${url.search}`);
    if (response.ok) {
        const skillsPageText = await response.text();
        const el = toHtml(skillsPageText)
        const table = el.querySelector('table');
        const links = table.querySelectorAll('a[href*="info="]');
        const result = [];
        links.forEach(item => {
            const name = item.textContent.trim();
            const id = new URL(item.href).searchParams.get('info');
            result.push({name, id, value: false});
        })
        return result;
    }
}

async function getInfo() {
    const response = await fetch(`${url.origin}/user.php${url.search}`);
    if (response.ok) {
        const userPageText = await response.text();
        const city = userPageText.match(/<b>Сейчас в:<\/b> ([А-я]+)/)[1];
        const lvl = userPageText.match(/<b>Уровень:<\/b> ([0-9]+)/)[1];
        return {city, lvl}
    }
}

function wait(sec = 0) {
    state.global.isRefresh = true;
    updateState({name: 'global', value: state.global});
    setTimeout(() => {
        refresh();
    }, sec * 1000);
}

function searchLink(text) {
    const links = [...document.getElementsByTagName("a")];
    const regEx = new RegExp(text);
    return links.find((e) => regEx.test(e.textContent));
}

function checkText(text) {
    const regExp = new RegExp(text);
    return regExp.test(document.body.innerHTML);
}

function resetRefresh() {
    if (state.global.isRefresh) {
        state.global.isRefresh = false;
        updateState({name: 'global', value: state.global});
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
            object = new CaptchaCapMonster(lvlArg);
            break;
        case "2":
            object = new CaptchaRuCaptcha(lvlArg);
            break;
        default:
            object = new CaptchaBase(lvlArg)
    }

    return object;
}


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
    ) {
        setTimeout(refresh, delay.long);
    }

    if (url.pathname === '/inventory.php' && changes.hasOwnProperty('inventory_filters')) {
        runFilter();
    }

    if (url.pathname !== '/world/world.php' && changes.hasOwnProperty('world') && changes.world.newValue.map !== 0) {
        window.location.href = `${url.origin}/world/world.php${url.search}`;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "scans-folders":
            scanFolders()
                .then(folders => {
                    sendResponse({name: 'folders', value: folders})
                });
            return true;
        default:
            return true;
    }
});

function updateState(payload, type = 'update') {
    chrome.runtime.sendMessage({action: 'set-state', type, payload});
}

async function scanFolders() {
    url.searchParams.set('chest', '1');
    const response = await fetch(`${url.origin}/inventory.php${url.search}`);
    if (response.ok) {
        const chestPageText = await response.text();
        const chestPageBody = chestPageText.replace(/\n/mg, '').match(/.*<body>(.+)<\/body>.*/)[0];
        const el = document.createElement('DIV');
        el.innerHTML = chestPageBody;
        const links = el.querySelectorAll('a[href*="chest=1&folder="]');
        const result = [];
        links.forEach(item => {
            const name = item.textContent.trim().replace(/\[\d+]$/, "");
            const id = new URL(item.href).searchParams.get('folder');
            result.push({name, id});
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


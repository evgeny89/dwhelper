// state
const initialState = {
    global: {
        isRefresh: false,
        run: false,
        sleep: null,
        to_url: false,
        textBadge: '',
        colorBadge: '',
        captcha: 0,
    },
    no_refresh: {
        link: null,
        sleepId: null,
    },
    totems: {
        run: false,
    },
    parcels: {
        send: false,
        fill: false,
        receive: false,
        theme: '1',
        text: '1',
    },
    extract: {
        run: false,
        type: 0,
        is_refresh: true,
        is_entered_code: false,
    },
    inventory_filters: {
        stones: 0,
        class: 0,
        sets: false,
        mods: false,
    },
    inventory_actions: {
        moved: 0,
        to_folders: 0,
    },
    folders: {},
    battles: {
        run: false,
    },
    world: {
        attack: false,
        attackAll: false,
        map: 0,
    },
    move: {
        routes: [],
        active: 0,
        step: 0,
    }
};

const state = {};

const paths = {
    world: {
        url: "/world/world.php",
        script: "./assets/js/content/world.js",
    },
    dungeon: {
        url: "/world/dungeon.php",
    },
    battles: {
        url: "/battle_group.php",
        script: "./assets/js/content/battles.js",
    },
    inventory: {
        url: "/inventory.php",
        script: "./assets/js/content/inventory.js",
    },
    parcels: {
        url: "/parcels.php",
        script: "./assets/js/content/parcels.js",
    },
    totems: {
        url: "/points.php",
        script: "./assets/js/content/totems.js",
    },
    extract: {
        url: "/world/resource.php",
        script: "./assets/js/content/extract.js",
    },
    service: "./assets/js/resources/captchaClass.js",
};

const setState = (payload) => {
    chrome.storage.local.set({[payload.name]: {...payload.value}});
}

const clearState = () => {
    chrome.storage.local.clear();
    chrome.storage.local.set({...initialState});
}

const setBadge = (textBadge, colorBadge) => {
    if (textBadge && colorBadge) {
        chrome.action.setBadgeText({text: textBadge});
        chrome.action.setBadgeBackgroundColor({color: colorBadge});
    }
}

chrome.runtime.onInstalled.addListener(function (details) {
    /*    if(details.reason === "install"){
            console.log("This is a first install!");
        }else if(details.reason === "update"){
            var thisVersion = chrome.runtime.getManifest().version;
            console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        }*/
    chrome.storage.local.set({...initialState});
});

chrome.storage.local.get(null, function (res) {
    Object.assign(state, res);

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.action === "get-state") {
                sendResponse(state);
            }
            if (request.action === "clear-state") {
                clearState();
                sendResponse(true);
            }
            if (request.action === "set-state") {
                if (request.type === "badge") {
                    const count = request.payload.value.textBadge;
                    const color = request.payload.value.colorBadge;
                    setBadge(count, color);
                }
                if (request.type === "sleep") {
                    const time = new Date(request.payload.value.sleep).getTime() - Date.now();
                    if (state.no_refresh.sleepId) {
                        clearTimeout(state.no_refresh.sleepId);
                    }
                    state.no_refresh.sleepId = setTimeout(() => {
                        state.global.sleep = null;
                        state.global.run = false;
                        setState({name: 'global', value: {...state.global}});
                    }, time);
                    setState({name: 'no_refresh', value: {...state.no_refresh}});
                }
                if (request.type === "cancel-sleep") {
                    clearTimeout(state.no_refresh.sleepId);
                }
                if (request.type === "update") {
                    if (request.payload.name === "world" && request.payload.value.map === 0) {
                        state.move.routes = [];
                        state.move.step = 0;
                        setState({name: "move", value: {...state.move}});
                    }
                }
                setState(request.payload);
            }
            if (request.action === 'scans-folders') {
                chrome.tabs.query({currentWindow: true}, function (tabs) {
                    const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
                    chrome.tabs.sendMessage(tab.id, {action: "scans-folders"}, function (response) {
                        setState(response);
                        sendResponse(true);
                    });
                });
                return true;
            }
            sendResponse(false);
        }
    );
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const currentUrl = new URL(tab.url);
    if (changeInfo.status === 'complete' && currentUrl.host === "dreamwar.ru" && state.global.run) {
        /* chrome.scripting.executeScript({
            target: {tabId: tabId },
            files: ['./assets/js/content/flasks.js'],
        });*/
        switch (currentUrl.pathname) {
            case paths.inventory.url:
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: [paths.inventory.script],
                });
                break;
            case paths.totems.url:
                if (state.totems.run) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: [paths.totems.script],
                    });
                }
                break;
            case paths.parcels.url:
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: [paths.parcels.script],
                });
                break;
            case paths.world.url:
            case paths.dungeon.url:
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: [paths.world.script, paths.service],
                });
                break;
            case paths.extract.url:
                if (state.extract.run) {
                    const execPaths = [paths.extract.script];

                    if (state.extract.type === "2") {
                        execPaths.unshift(paths.service);
                    }

                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: execPaths,
                    });
                }
                break;
            case paths.battles.url:
                if (state.battles.run) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: [paths.battles.script],
                    });
                }
                break;
        }
    }
})

chrome.storage.onChanged.addListener(function (changes) {
    for (const prop in changes) {
        state[prop] = {...changes[prop].newValue};
    }
});

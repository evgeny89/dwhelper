// state
const initialState = {
    global: {
        sound: false,
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
    castle: {
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
    skills: {},
    battles: {
        run: false,
    },
    world: {
        attack: false,
        attackAll: false,
        highLair: false,
        slave: false,
        map: 0,
        scrollLife: null,
        scrollMana: null,
    },
    move: {
        routes: [],
        active: 0,
        step: 0,
    },
};

const state = {};

const paths = {
    world: {
        url: "/world/world.php",
        script: {
            master: "./assets/js/content/world.js",
            slave: "./assets/js/content/world-slave.js",
        },
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
    castle: {
        url: "/world/castle.php",
        script: "./assets/js/content/castle.js",
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

const setBadge = (textBadge = '', colorBadge = "blue") => {
    chrome.action.setBadgeText({text: textBadge});
    chrome.action.setBadgeBackgroundColor({color: colorBadge});
}

function playSound() {
    let url = chrome.runtime.getURL('assets/src/audio.html');

    chrome.windows.create({
        type: 'panel',
        focused: true,
        top: 50,
        left: 1,
        height: 1,
        width: 260,
        url,
    })
}

const showMessage = (payload) => {
    const message = {
        type: 'basic',
        iconUrl: './../src/dw128.png',
        title: "????????????????????",
        message: payload.text,
    }

    chrome.notifications.create("myNotificationID", message, function() {
        if (payload.warn || state.global.sound) {
            playSound();
        }
    })
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

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action === "get-state") {
                sendResponse(state);
            }
            if (request.action === "clear-state") {
                clearState();
                sendResponse(true);
            }
            if (request.action === "show-message") {
                showMessage(request.payload);
                sendResponse(true);
            }
            if (request.action === "set-state") {
                if (request.type === "badge") {
                    const text = request.payload.text;
                    const color = request.payload.color;
                    setBadge(text, color);
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
                    if (request.payload.name === "world" && request.payload.value.map === '0') {
                        state.move.routes = [];
                        state.move.step = 0;
                        state.move.active = 0;
                        setState({name: "move", value: {...state.move}});
                    }
                }
                setState(request.payload);
            }
            if (request.action === 'scan-folders') {
                chrome.tabs.query({currentWindow: true}, function (tabs) {
                    const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
                    chrome.tabs.sendMessage(tab.id, {action: "scan-folders"}, function (response) {
                        setState(response);
                        sendResponse(true);
                    });
                });
                return true;
            }
            if (request.action === 'scan-skills') {
                chrome.tabs.query({currentWindow: true}, function (tabs) {
                    const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
                    if (tab) {
                        chrome.tabs.sendMessage(tab.id, {action: "scan-skills"}, function (response) {
                            setState(response);
                            sendResponse(true);
                        });
                    } else {
                        sendResponse(false);
                    }
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
                const execPaths = [paths.service];

                if (state.world.slave) {
                    execPaths.push(paths.world.script.slave);
                } else {
                    execPaths.push(paths.world.script.master);
                }

                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: execPaths,
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
            case paths.castle.url:
                if (state.castle.run) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: [paths.castle.script],
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

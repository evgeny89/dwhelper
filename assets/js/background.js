// state
const initialState = {
    battles: {
        attack: 1,
        defence: 1,
        run: false,
    },
    castle: {
        run: false,
    },
    extract: {
        run: false,
        type: 0,
        is_refresh: true,
        is_entered_code: false,
    },
    folders: {},
    global: {
        sound: false,
        isRefresh: false,
        run: false,
        sleep: null,
        to_url: false,
        textBadge: '',
        colorBadge: '',
        captcha: 0,
        withRage: false,
        debug: false,
    },
    inventory_actions: {
        moved: 0,
        to_folders: 0,
    },
    inventory_filters: {
        stones: 0,
        class: 0,
        sets: false,
        mods: false,
    },
    move: {
        routes: [],
        active: 0,
        step: 0,
    },
    no_refresh: {
        link: null,
        sleepId: null,
    },
    parcels: {
        send: false,
        fill: false,
        receive: false,
        theme: '1',
        text: '1',
    },
    quests: {
        sulfurCollection: false,
        helpInBattles: false,
        assistanceInSieges: false,
        secretMission: false,
        enemySupplies: false,
        importantSupplies: false,
        attackTheEnemy: false,
        defenceOfTerritories: false,
        clearingTheLaboratory: false,
        arenaBattle: false,
        difficultArenaBattle: false,
        colosseumQuest: false,
    },
    skills: {},
    totems: {
        run: false,
    },
    world: {
        attack: false,
        attackAll: false,
        highArena: false,
        highLair: false,
        slave: false,
        map: 0,
        scrollLife: null,
        scrollMana: null,
    },
};

const state = {};

const paths = {
    world: {
        url: "/world/world.php",
        script: {
            master: "assets/js/content/world.js",
            slave: "assets/js/content/world-slave.js",
        },
    },
    dungeon: {
        url: "/world/dungeon.php",
    },
    battlefield: {
        url: "/battleground.php",
    },
    battles: {
        url: "/battle_group.php",
        script: "assets/js/content/battles.js",
    },
    inventory: {
        url: "/inventory.php",
        script: "assets/js/content/inventory.js",
    },
    parcels: {
        url: "/parcels.php",
        script: "assets/js/content/parcels.js",
    },
    totems: {
        url: "/points.php",
        script: "assets/js/content/totems.js",
    },
    extract: {
        url: "/world/resource.php",
        script: "assets/js/content/extract.js",
    },
    castle: {
        url: "/world/castle.php",
        script: "assets/js/content/castle.js",
    },
    service: "assets/js/resources/captchaClass.js",
    main: "assets/js/content/content-script.js",
    config: "assets/js/content/config.js",
};

const questsIds = {
    sulfurCollection: 4,
    helpInBattles: 6,
    assistanceInSieges: 7,
    secretMission: 8,
    enemySupplies: 10,
    importantSupplies: 11,
    attackTheEnemy: 14,
    defenceOfTerritories: 13,
    clearingTheLaboratory: 15,
    arenaBattle: 16,
    difficultArenaBattle: 17,
    colosseumQuest: 26,
}

const buffs = {
    default: [-1, -2, -3, -4, -5, -7, -8, -9],
    defaultRage: [-6],
    advanced: [-101, -102, -103, -104, -105, -107, -108, -109],
    advancedRage: [-106],
}

const setState = (payload) => {
    chrome.storage.local.set(payload);
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
        title: "Информация",
        message: payload.text,
    }

    chrome.notifications.create("myNotificationID", message, function() {
        if (payload.warn || state.global.sound) {
            playSound();
        }
    })
}

const getQuestsIds = () => {
    const result = [];
    for (const key in state.quests) {
        if (state.quests[key]) {
            result.push(questsIds[key]);
        }
    }
    return result;
}

const getBuffsIds = (type) => {
    const buffsIds = buffs[type];

    if (state.global.withRage) {
        buffsIds.push(...buffs[type + 'Rage']);
    }

    return buffsIds;
}

chrome.runtime.onInstalled.addListener(function (details) {
    /*    if(details.reason === "install"){
            console.log("This is a first install!");
        }else if(details.reason === "update"){
            var thisVersion = chrome.runtime.getManifest().version;
            console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        }*/
    chrome.storage.local.set({...initialState});
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
        if (!tab) {
            return;
        }
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: [paths.config, paths.main],
        })
            .then(async () => {
                const folders = await chrome.tabs.sendMessage(tab.id, {action: "scan-folders"});
                setState(folders);

                const skills = await chrome.tabs.sendMessage(tab.id, {action: "scan-skills"});
                setState(skills);

                const response = await chrome.tabs.sendMessage(tab.id, {action: "refresh"});
                showMessage(response);
            });
    });
});

chrome.storage.local.get(null, function (res) {
    Object.assign(state, res);
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let data = {...request.payload}

    if (request.action === "get-state") {
        if (request.payload === 'content') {
            sendResponse(state);
        } else {
            chrome.tabs.query({currentWindow: true}, function (tabs) {
                const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, {action: "get-captcha"}, function (response) {
                        sendResponse({...state, ...response});
                    });
                } else {
                    sendResponse(false);
                }
            });
        }
        return true;
    }
    if (request.action === "clear-state") {
        clearState();
        sendResponse(true);
    }
    if (request.action === "show-message") {
        showMessage(data);
        sendResponse(true);
    }
    if (request.action === "set-state") {
        if (request.type === "badge") {
            setBadge(data.text, data.color);
        }
        if (request.type === "sleep") {
            const time = new Date(data.global.sleep).getTime() - Date.now();
            if (state.no_refresh.sleepId) {
                clearTimeout(state.no_refresh.sleepId);
            }
            state.no_refresh.sleepId = setTimeout(() => {
                state.global.sleep = null;
                state.global.run = false;
                data = {
                    global: state.global,
                    ...data
                }
            }, time);
            data = {
                no_refresh: state.no_refresh,
                ...data
            }
        }
        if (request.type === "cancel-sleep") {
            clearTimeout(state.no_refresh.sleepId);
        }
        if (request.type === "update") {
            if (data.world && +data.world.map === 0) {
                state.move.routes = [];
                state.move.step = 0;
                state.move.active = 0;
                data = {
                    move: state.move,
                    ...data
                }
            }
        }
        setState(data);
        sendResponse(true);
    }
    if (request.action === 'scan-folders') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
            if (tab) {
                chrome.tabs.sendMessage(tab.id, {action: "scan-folders"}, function (response) {
                    setState(response);
                    sendResponse(true);
                });
            } else {
                sendResponse(false);
            }
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
    if (request.action === 'take-quests' || request.action === 'pass-quests') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
            if (tab) {
                const payload = {
                    ids: getQuestsIds(),
                    key: request.action === 'pass-quests' ? 'end' : 'get',
                };
                chrome.tabs.sendMessage(tab.id, {action: request.action, payload}, function (response) {
                    setState({quests: initialState.quests});
                    sendResponse(response);
                });
            } else {
                sendResponse(false);
            }
        });
        return true;
    }
    if (request.action === 'default-buffs' || request.action === 'advanced-buffs') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
            if (tab) {
                const type = request.action === 'default-buffs' ? 'default' : 'advanced'
                const payload = {
                    ids: getBuffsIds(type),
                };
                chrome.tabs.sendMessage(tab.id, {action: 'take-buffs', payload}, function (response) {
                    sendResponse(response);
                });
            } else {
                sendResponse(false);
            }
        });
        return true;
    }
    sendResponse(false);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const currentUrl = new URL(tab.url);
    if (changeInfo.status === 'complete' && currentUrl.host === "dreamwar.ru" && state.global?.run) {
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
            case paths.dungeon.url:
            case paths.battlefield.url:
            case paths.world.url:
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
                if (state.castle.run && !(currentUrl.searchParams.get("id") || currentUrl.searchParams.get("all"))) {
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

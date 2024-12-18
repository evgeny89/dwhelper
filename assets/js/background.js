// state
const initialState = {
    battles: {
        attack: '1',
        check_enemy: true,
        defence: '1',
        faster: false,
        run: false,
    },
    battlefield: {
        run: false,
        map: null,
        step: 0,
    },
    captcha: {},
    castle: {
        run: true,
        attackBoss: false,
        checkUndergroundQuest: true,
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
        isAccepted: false,
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
        fill: true,
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
    temp: {
        od: 0,
    },
    totems: {
        run: true,
    },
    workshop: {
        run: true,
    },
    world: {
        attack: false,
        attackAll: false,
        highArena: false,
        highLair: false,
        infinityArena: false,
        manyMobs: false,
        slave: false,
        returned: true,
        map: 0,
        scrollLife: null,
        scrollMana: null,
    },
    user: {
        city: null,
        lvl: null,
        clan_id: null,
        side: null,
        od: null,
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
        script: {
            date: "assets/js/resources/battlefieldDate.js",
            main: "assets/js/content/battlefield.js",
        },
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
    craft: {
        url: "/craft.php",
        script: "assets/js/content/craft.js",
    },
    service: "assets/js/resources/captchaClass.js",
    main: "assets/js/content/content-script.js",
    config: "assets/js/content/config.js",
    dayjs: "assets/js/vendor/dayjs.min.js",
    secret: "secret.js",
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

const accepted = [
    "71f49d2c6c0de6727372554a401fb2b74e51d207ddc65b2b0ef2fa1d71a95a67",
    "2b3a393aa43a3ac189236bc3df1fbef253c62be08c6d34ef69451be13fa0e84e",
    "45fedf79353172120aa5160f7ff3fcb86879fe67639d2692a5ef03ca06e8d891",
    "ebc687006ad26b2a4a3ee4b9fdbe960207994244fa9893310c23c225b58ae692",
    "6715f9b6247281ac1c461770ab0f5fb215315531f3c68a754a8166ffc4092abc",
    "f1e5b1e30a4015dc1373cbb6d78baeb365414b6ca9533c79cb6d333dae20ce98",
    "2965c656562ff3823d59d0bacd0cddd8c81f1c7b9fc737cab9b7f27c9d174242",
    "5afcdf93cc575872f7972ba2b124ef7b526359cf4c8032a4f2dd6e58cc9eea58",
    "37c623a173805e0e4ba00e1db66cd67b987ebc1854b08d03803097cd6873164d",
    "6667e73f5a4a1749a7cd9bde2f80befcda3fa9dee6774155a81d1661b80289c1",
    "bd56fc462f8abd0cde2f74c03d8b14646fe6a24023377eb03724a4ba03ca6fca",
    "27dea3a8eb8838a12f6cf0d9d302204bb9d3b88744cad324d184795b6bb0524b",
]

const setState = (payload) => {
    chrome.storage.local.set(payload);
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
    const id = `DwhelperId-${Date.now()}`;
    const message = {
        type: 'basic',
        iconUrl: './../src/dw128.png',
        title: "Информация",
        message: payload.text,
    }

    chrome.notifications.create(id, message, function() {
        if (payload.warn || state.global.sound) {
            playSound();
        }
    })

    if (!payload.warn) {
        setTimeout(() => chrome.notifications.clear(id), 10000);
    }
}

const rightRotate = (value, amount) => {
    return (value >>> amount) | (value << (32 - amount));
}

const sha256 = (ascii) => {
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length'
    let i, j;
    let result = ''
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = sha256.h = sha256.h || [];
    const k = sha256.k = sha256.k || [];
    let primeCounter = k[lengthProperty];
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80'
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return;
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)


    for (j = 0; j < words[lengthProperty];) {
        const w = words.slice(j, j += 16);
        const oldHash = hash;
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            const w15 = w[i - 15], w2 = w[i - 2];
            const a = hash[0], e = hash[4];
            const temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                + ((e & hash[5]) ^ ((~e) & hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0
                );

            const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

const validateUser = (uid) => {
    if (!uid) {
        state.global.isAccepted = false;
        return;
    }
    const hash = sha256(uid);
    initialState.global.isAccepted = accepted.includes(hash);
    setState({global: initialState.global})
}

const loadDynamicValues = (installed = false) => {
    const message = installed ? "Расширение успешно обновлено" : "Настройки сброшены!";
    chrome.tabs.query({currentWindow: true}, async function (tabs) {
        const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));

        if (!tab) {
            const message = "Активная вкладка игры не найдена - бот не установлен. Откройте вкладку игры и нажмите кнопку сбросить настройки.";
            showMessage({warn: true, text: message});
            return;
        }

        const url = new URL(tab.url);
        validateUser(url.searchParams.get('UIN'))

        if (installed) {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: [paths.secret, paths.dayjs, paths.config, paths.main],
            })
        }

        const captcha = await chrome.tabs.sendMessage(tab.id, {action: "get-captcha"});
        setState(captcha);

        await chrome.tabs.sendMessage(tab.id, {action: "parse-user"});

        const folders = await chrome.tabs.sendMessage(tab.id, {action: "scan-folders"});
        setState(folders);

        const skills = await chrome.tabs.sendMessage(tab.id, {action: "scan-skills"});
        setState(skills);

        await chrome.tabs.sendMessage(tab.id, {action: "refresh"});
        showMessage({warn: true, text: message});
        setBadge();
    });
}

const clearState = () => {
    chrome.storage.local.clear();
    chrome.storage.local.set({...initialState});
    loadDynamicValues();
}

const setBadge = (textBadge = '', colorBadge = "blue") => {
    chrome.action.setBadgeText({text: textBadge});
    chrome.action.setBadgeBackgroundColor({color: colorBadge});
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

const makeCsrf = (token, sid) => {
    if (!state.global.isAccepted) {
        return "hacking_attempt";
    }
    let result = "";
    for (let i = 0; i !== token.length; i++) {
        result += token[i] + (sid[i] ? sid[i] : "");
    }

    return btoa(result)
        .replace(/=/g, "")
        .split("")
        .reverse()
        .join("")
        .toLowerCase();
}

chrome.runtime.onInstalled.addListener(function (details) {
    /*    if(details.reason === "install"){
            console.log("This is a first install!");
        }else if(details.reason === "update"){
            var thisVersion = chrome.runtime.getManifest().version;
            console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        }*/
    chrome.storage.local.set({...initialState});
    loadDynamicValues(true);
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
                sendResponse(state);
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
                    setState({folders: {}});
                    setState(response);
                    sendResponse(true);
                });
            } else {
                sendResponse(false);
            }
        });
        return true;
    }
    if (request.action === 'make-token') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            sendResponse( makeCsrf(request.payload.token, request.payload.sid));
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
    if (request.action === 'gradeon' || request.action === 'gradeoff') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
            if (tab) {
                const payload = {
                    type: request.action,
                };

                chrome.tabs.sendMessage(tab.id, {action: 'flasks', payload}, function (response) {
                    sendResponse(response);
                });
            } else {
                sendResponse(false);
            }
        });
        return true;
    }
    if (request.action === 'create-battleground' || request.action === 'ready-battleground') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
            if (tab) {
                const [type, action] = request.action.split('-');
                chrome.tabs.sendMessage(tab.id, {action: action, type}, function (response) {
                    sendResponse(response);
                });
            } else {
                sendResponse(false);
            }
        });
        return true;
    }
    if (request.action === 'break-items') {
        chrome.tabs.query({currentWindow: true}, function (tabs) {
            const tab = tabs.find(item => /^.+?dreamwar.ru.+/.test(item.url));
            if (tab) {
                chrome.tabs.sendMessage(tab.id, {action: request.action}, function (response) {
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
                if (state.castle.run && !currentUrl.searchParams.get("all")) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: [paths.castle.script],
                    });
                }
                break;
            case paths.craft.url:
                if (state.workshop.run) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: [paths.craft.script],
                    });
                }
                break;
            case paths.battlefield.url:
                if (state.battlefield.run) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: [paths.battlefield.script.date, paths.battlefield.script.main],
                    });
                }
                break;
        }

        if (currentUrl.pathname !== paths.battlefield.url && state.battlefield.run) {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: [paths.battlefield.script.date, paths.battlefield.script.main],
            });
        }
    }
})

chrome.storage.onChanged.addListener(function (changes) {
    for (const prop in changes) {
        state[prop] = {...changes[prop].newValue};
    }
});

const maps = {
    empty: "",
    lair: { // к логову и обратно
        fromKorheim: '488666666666666666666666662222222666666666666666666666666',
        toKorheim: '444444444444444444444444888888844444444444444444444444226',
        fromNecropolis: '666666662222666666666666666666666666',
        toNecropolis: '444444444444444444444444888844444444',
    },
    castle: { // во дворец и назад
        fromKorheim: "488666666666666222222",
        fromNecropolis: "224442",
        toKorheim: "888888444444444444226",
        toNecropolis: "888666",
    },
    fallen: '42222442444442444884888484', // падшие
    dragons: {
        entry: '222688442286', //драконы вход
        west: '44442424242222222222222222262626626668884686484686422222266668686868868844226888888888888888484844862', //Драконы запад.
        east: '666624662626222222222222222688442262242424424444444848484626266266688846864846864', // Драконы восток.
        north: '22222222222222222642462642462224444848484626266266666668686868848862268848888888888888484844862', // Драконы центр.
    },
    mysterious: '6688662266666666824444444488442244888866884488666622666666226666668844448844448866888866668866226682448844222266222268844228868866662266224422666622668888668888448866886884426222662', // тайны
}
let increment = true;

const getDragonsKey = async (iteration = 1) => {
    if (iteration > 5) {
        return 0;
    }
    if (!url.searchParams.has('type')) {
        url.searchParams.set('type', '5');
    }

    const response = await fetch(`${url.origin}/service_events.php${url.search}`);
    if (response.ok) {
        const text = await response.text();
        const regex = /Ключ (.+?) Прохода Пещеры Драконов/
        const found = text.match(regex)[1];

        switch (found) {
            case "Западного":
                return 1
            case "Восточного":
                return 2
            case "Северного":
                return 3
        }
    }
    return await getDragonsKey(iteration++);
}

const getDragonsPath = async () => {
    const key = await getDragonsKey();

    switch (key) {
        case 1:
            return maps.dragons.west
        case 2:
            return maps.dragons.east
        case 3:
            return maps.dragons.north
        default:
            return maps.empty
    }
}

// после инициализации методов
const routeFunctions = {
    chooseDragonPath: getDragonsPath,
}

const doStep = (direction) => {
    const link = document.querySelector(`a[accesskey="${direction}"]`);
    if (link) {
        link.click();
    } else {
        state.move.step -= 1;
        updateState({name: 'move', value: {...state.move}})
    }
}

const getDungeonsId = (name, lvl) => {
    switch (name) {
        case words.lairForsworn:
            return 10;
        case words.lairFallen:
            if (lvl >= 65 && lvl <= 68) return 11;
            if (lvl >= 69 && lvl <= 72) return 13;
            return 16;
        case words.lairDragon:
            if (lvl >= 68 && lvl <= 72) return 12;
            return 15;
        case words.lairMysterious:
            if (lvl >= 69 && lvl <= 72) return 14;
            return 17;
        default:
            return 0;
    }
}

const getDungeonsLink = (dungeonsName, userLvl) => {
    const dungeonID = getDungeonsId(dungeonsName, userLvl);
    url.searchParams.set('dungeon_id', String(dungeonID));
    return `${url.origin}/world/dungeon.php${url.search}`;
}

const goToUrl = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.click();
}

const updateStepInState = () => {
    state.move.step += 1;
    updateState({name: 'move', value: {...state.move}})
}

const dropMap = () => {
    state.world.map = 0;
    updateState({name: 'world', value: {...state.world}});
}

const solve = async () => {
    increment = false;
    const instance = await getServiceCaptchaInstance();
    const img = document.querySelector('img[src*="../caramba.php"]')
    instance.getImage(img);
    const localAnswer = instance.checkLocalAnswer();

    if (localAnswer) {
        instance.submitCode(localAnswer);
    } else {
        await instance.createTask();
    }
}

class UserInfo {
    city = "";
    lvl = "";

    constructor(info) {
        this.city = info.city;
        this.lvl = info.lvl;
    }

    static async fetchCity() {
        const info = await getInfo();
        return new UserInfo(info);
    }

    getForward = () => {
        switch (this.city) {
            case "Корхейм":
                return "fromKorheim";
            case "Некрополь":
                return "fromNecropolis";
            default:
                return "empty"
        }
    }

    getBack = () => {
        switch (this.city) {
            case "Корхейм":
                return "toKorheim";
            case "Некрополь":
                return "toNecropolis";
            default:
                return "empty"
        }
    }
}

if (checkText(words.captcha)) {
    solve();
}

if ((state.world.attack && !checkText("Север:")) || state.world.attackAll) {
    const link = searchLink(words.toAttack) || searchLink(words.inBattle);
    if (link) {
        increment = false;
        link.click();
    }
}

if (+state.world.map && !state.move.routes.length) {
    (async () => {
        const info = await UserInfo.fetchCity();

        const routes = {
            1: [
                maps.lair[info.getForward()],
                [words.toLairsLobby, getDungeonsLink(words.lairForsworn, info.lvl)],
                maps.fallen,
                [words.leaveLairsLobby, words.yes],
                maps.lair[info.getBack()],
                [words.toCity]
            ],
            2: [
                maps.lair[info.getForward()],
                [words.toLairsLobby, getDungeonsLink(words.lairFallen, info.lvl)],
                maps.fallen,
                [words.leaveLairsLobby, words.yes],
                maps.lair[info.getBack()],
                [words.toCity]
            ],
            3: [
                maps.lair[info.getForward()],
                [words.toLairsLobby, getDungeonsLink(words.lairDragon, info.lvl)],
                maps.dragons.entry,
                'chooseDragonPath',
                [words.leaveLairsLobby, words.yes],
                maps.lair[info.getBack()],
                [words.toCity]
            ],
            4: [
                maps.lair[info.getForward()],
                [words.toLairsLobby, getDungeonsLink(words.lairMysterious, info.lvl)],
                maps.mysterious,
                [words.leaveLairsLobby, words.yes],
                maps.lair[info.getBack()],
                [words.toCity]
            ],
            5: [
                maps.lair[info.getForward()],
                [words.toLairsLobby, getDungeonsLink(words.lairFallen, info.lvl)],
                maps.fallen,
                [words.leaveLairsLobby, words.yes],
                [words.toLairsLobby, getDungeonsLink(words.lairDragon, info.lvl)],
                maps.dragons.entry,
                'chooseDragonPath',
                [words.leaveLairsLobby, words.yes],
                [words.toLairsLobby, getDungeonsLink(words.lairMysterious, info.lvl)],
                maps.mysterious,
                [words.leaveLairsLobby, words.yes],
                maps.lair[info.getBack()],
                [words.toCity]
            ],
            6: [
                maps.castle[info.getForward()],
                [words.castleName],
                maps.castle[info.getBack()],
                [words.toCity]
            ],
        }

        state.move.routes = routes[state.world.map];
        updateState({name: 'move', value: {...state.move}});
        refresh();
    })();
} else if (+state.world.map && state.move.routes.length && increment) {
    const step = state.move.step;
    const activeRoute = state.move.routes[state.move.active];
    const currentStep = activeRoute[step];

    if (step < activeRoute.length) {
        if (/^http(s?):\/\/.+$/.test(currentStep)) {
            updateStepInState();
            goToUrl(currentStep);
        } else if (routeFunctions[activeRoute]) {
            (async () => {
                state.move.routes[state.move.active] = await routeFunctions[currentStep]();
                updateState({name: 'move', value: {...state.move}});
                refresh();
            })()
        } else if (isNaN(currentStep)) {
            updateStepInState();
            setTimeout(() => {
                if (!state.move.routes[state.move.active + 1] && !activeRoute[step + 1]) {
                    dropMap();
                }
                searchLink(currentStep).click();
            }, delay.fast)
        } else if (checkText("Север:")) {
            updateStepInState();
            setTimeout(doStep, delay.fast, currentStep);
        }
    } else if (state.world.map && state.move.routes[state.move.active + 1]) {
        state.move.active += 1;
        state.move.step = 0;
        updateState({name: 'move', value: {...state.move}});
        setTimeout(refresh, delay.long);
    } else {
        dropMap();
    }
}

const maps = {
    empty: "",
    toLairFromKorheim: '488666666666666666666666662222222666666666666666666666666', // к логову из корха
    toKorheim: '444444444444444444444444888888844444444444444444444444226', // в корх от логова
    toLairFromNecropolis: '666666662222666666666666666666666666', // к логову из некра
    toNecropolis: '444444444444444444444444888844444444', // в некр от логова
    fallen: '42222442444442444884888484', // падшие
    test1: '224442',
    test2: '888666',
}

let increment = true;

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
    return `${url.origin}/world/dungeon.php${url.search}&dungeon_id=${dungeonID}`;
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

const solve = async() => {
    increment = false;
    const instance = await getServiceCaptchaInstance();
    const img = document.querySelector('img[src*="../caramba.php"]')
    instance.getImage(img);
    const localAnswer = instance.checkLocalAnswer();

    console.log(localAnswer)

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
                return "toLairFromKorheim";
            case "Некрополь":
                return "toLairFromNecropolis";
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
                1: [maps[info.getForward()]],
                2: [maps[info.getBack()]],
                3: [
                    maps[info.getForward()],
                    [words.toLairsLobby, getDungeonsLink(words.lairFallen, info.lvl)],
                    maps.fallen,
                    [words.leaveLairsLobby, words.yes],
                    maps[info.getBack()]
                ],
                4: [maps[info.getForward()], maps[info.getBack()]],
                5: [maps.test1],
                6: [maps.test2, [words.toCity]]
            }

            state.move.routes = routes[state.world.map];
            updateState({name: 'move', value: {...state.move}});
            refresh();
        })();
    }
else if (+state.world.map && state.move.routes.length && increment) {
    const step = state.move.step;

    if (step < state.move.routes[state.move.active].length) {
        if (/^http(s?):\/\/.+$/.test(state.move.routes[state.move.active][step])) {
            updateStepInState();
            goToUrl(state.move.routes[state.move.active][step]);
        }
        else if (isNaN(state.move.routes[state.move.active][step])) {
            updateStepInState();
            setTimeout(() => {
                searchLink(state.move.routes[state.move.active][step]).click();
            }, delay.fast)
        }
        else if (checkText("Север:")) {
            updateStepInState();
            setTimeout(doStep, delay.fast, state.move.routes[state.move.active][step]);
        }
    }
    else if (state.world.map && state.move.routes[state.move.active + 1]) {
        state.move.active += 1;
        state.move.step = 0;
        updateState({name: 'move', value: {...state.move}});
        setTimeout(refresh, delay.long);
    }
    else {
        state.move.routes = [];
        state.move.step = 0;
        state.move.active = 0;
        updateState({name: 'move', value: {...state.move}});

        state.world.map = 0;
        updateState({name: 'world', value: {...state.world}});
    }
}

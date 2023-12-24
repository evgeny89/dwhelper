waitToReadyState().then(async () => {
    const maps = {
        empty: "",
        lair: { // к логову и обратно
            fromKorheim: '488666666666666666666666662222222666666666666666666666666',
            toKorheim: '444444444444444444444444888888844444444444444444444444226',
            fromNecropolis: '666666662222666666666666666666666666',
            toNecropolis: '444444444444444444444444888844444444',
        },
        arena: { // к арене (обратно от логова...)
            fromKorheim: '488688',
            fromNecropolis: '4448884444444444488',
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
            west: '444424242422222222222222222626266266688846864846864222222666686868688888888888888888484844862', //Драконы запад.
            east: '6666246626262222222222222222242424424444444848484626266266688846864846864', // Драконы восток.
            north: '222222222222222226424626424622244448484846262662666666686868688888888888888888484844862', // Драконы центр.
        },
        mysterious: '6688662266666666824444444488442244888866884488666622666666226666668844448844448866888866668866226682448844222266222268844228868866662266224422666622668888668888448866886884426222662', // тайны
    }
    const arenaQuestsData = {ids: [16, 17], key: 'get'}
    let increment = true;

    const getDragonsKey = async (iteration = 1) => {
        if (iteration > 5) {
            return 0;
        }
        if (!url.searchParams.has('type')) {
            url.searchParams.set('type', '5');
        }

        const response = await fetch(`${url.origin}${pathNames.events}${url.search}`);
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
            updateState({move: state.move})
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
        if (state.world.highLair) {
            url.searchParams.set('hard', '1');
        }
        return `${url.origin}${pathNames.lairLobby}${url.search}`;
    }

    const goToUrl = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.click();
    }

    const updateStepInState = () => {
        state.move.step += 1;
        updateState({move: state.move})
    }

    const dropMap = () => {
        state.world.map = 0;
        updateState({world: state.world});
    }

    const solve = async () => {
        increment = false;
        const instance = await getServiceCaptchaInstance();
        if (!instance) {
            notify(messages.captcha);
            return;
        }
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

        static async getUserData() {
            const info = await getInfo();
            return new UserInfo(info);
        }

        getForward = (type) => {
            if (type === "lair"
                && (
                    (
                        url.pathname === pathNames.world
                        && (searchLink(words.toLairsLobby) || !searchLink(words.toCity))
                    )
                    || (searchLink(words.lairForsworn) && url.pathname === pathNames.lairLobby)
                )
            ) {
                return maps.empty;
            }
            if (type === "castle" && checkText(words.castleName)) {
                return maps.empty;
            }
            if (type === "arena" && checkText(words.arena)) {
                return maps.empty;
            }

            switch (this.city) {
                case "Корхейм":
                    return maps[type].fromKorheim;
                case "Некрополь":
                    return maps[type].fromNecropolis;
                default:
                    return maps.empty;
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

    const pathBack = (user) => {
        return [
            [words.leaveLairsLobby, words.yes],
            maps.lair[user.getBack()],
            [words.toCity]
        ]
    }

    const checkInLair = (type, user) => {
        if (
            url.pathname === pathNames.index
            || (
                url.pathname === pathNames.world
                && (searchLink(words.toLairsLobby) || searchLink(words.toCity))
            )
        ) {
            return [words.toLairsLobby, getDungeonsLink(type, user.lvl)];
        }

        if (searchLink(words.lairForsworn) && url.pathname === pathNames.lairLobby) {
            return [getDungeonsLink(type, user.lvl)];
        }

        return maps.empty;
    }

    const leaveArena = () => {
        const arenaLvlRegex = new RegExp(`${words.arenaLvl} (\\d{1,2})`);
        const currentLvl = document.body.innerHTML.match(arenaLvlRegex)[1];

        if (state.world.highArena) {
            return currentLvl > 23;
        }
        return currentLvl > 17;
    }

    const arenaLogic = () => {
        if (leaveArena()) {
            const link = searchLink(words.leaveLairsLobby);

            if (link) {
                link.click();
            }
        }

        if ((state.world.attack && !checkText("Север:")) || state.world.attackAll) {
            const link = searchLink(words.toAttack) || searchLink(words.inBattle) || searchLink(words.help);
            if (link) {
                link.click();
            }
        } else {
            wait(20);
        }
    }

    const isArena = checkText(words.arenaLvl) && +state.world.map === 7;

    if (checkText(words.captcha)) {
        return await solve();
    } else {
        if (isArena) {
            arenaLogic();
        }

        if (checkText(words.failLvlLair) || checkText(words.failTimeLair)) {
            dropMap();
        }

        if (!isArena) {
            if (state?.world && state?.move) {
                if ((state.world.attack && !checkText("Север:")) || state.world.attackAll) {
                    const link = searchLink(words.toAttack) || searchLink(words.inBattle);
                    if (link) {
                        increment = false;
                        link.click();
                    }
                }

                if (+state.world.map && !state.move.routes.length) {
                    await (async () => {
                        const info = await UserInfo.getUserData();

                        const routes = {
                            1: [
                                info.getForward("lair"),
                                checkInLair(words.lairForsworn, info),
                                maps.fallen,
                                ...pathBack(info),
                            ],
                            2: [
                                info.getForward("lair"),
                                checkInLair(words.lairFallen, info),
                                maps.fallen,
                                ...pathBack(info),
                            ],
                            3: [
                                info.getForward("lair"),
                                checkInLair(words.lairDragon, info),
                                maps.dragons.entry,
                                'chooseDragonPath',
                                ...pathBack(info),
                            ],
                            4: [
                                info.getForward("lair"),
                                checkInLair(words.lairMysterious, info),
                                maps.mysterious,
                                ...pathBack(info),
                            ],
                            5: [
                                info.getForward("lair"),
                                checkInLair(words.lairFallen, info),
                                maps.fallen,
                                [words.leaveLairsLobby, words.yes],
                                checkInLair(words.lairDragon, info),
                                maps.dragons.entry,
                                'chooseDragonPath',
                                [words.leaveLairsLobby, words.yes],
                                checkInLair(words.lairMysterious, info),
                                maps.mysterious,
                                ...pathBack(info),
                            ],
                            6: [
                                info.getForward("castle"),
                                [words.castleName],
                                maps.castle[info.getBack()],
                                [words.toCity]
                            ],
                            7: [
                                await queryQuests(arenaQuestsData),
                                info.getForward("arena"),
                                [words.arena],
                                [words.yes],
                                maps.lair[info.getBack()],
                                [words.toCity]
                            ],
                            8: [
                                info.getForward("lair"),
                                checkInLair(words.lairFallen, info),
                                maps.fallen,
                                [words.leaveLairsLobby, words.yes],
                                checkInLair(words.lairDragon, info),
                                maps.dragons.entry,
                                'chooseDragonPath',
                                ...pathBack(info),
                            ],
                        }

                        state.move.routes = routes[+state.world.map];
                        updateState({move: state.move});
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
                        } else if (routeFunctions.hasOwnProperty(activeRoute)) {
                            await (async () => {
                                state.move.routes[state.move.active] = await routeFunctions[activeRoute]();
                                updateState({move: state.move});
                                refresh();
                            })()
                        } else if (isNaN(currentStep)) {
                            updateStepInState();
                            setTimeout(() => {
                                if (currentStep === words.toCity) {
                                    dropMap();
                                }
                                searchLink(currentStep).click();
                            }, delay.fast)
                        } else if (checkText("Север:")) {
                            updateStepInState();
                            setTimeout(doStep, delay.fast, currentStep);
                        }
                    } else if (+state.world.map && state.move.routes[state.move.active + 1] !== undefined) {
                        state.move.active += 1;
                        state.move.step = 0;
                        updateState({move: state.move});
                        setTimeout(refresh, delay.long);
                    } else {
                        dropMap();
                    }
                }
            } else {
                if (!isArena) {
                    wait();
                }
            }
        }
    }
});

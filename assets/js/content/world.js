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
            west_alt: '44442424242222222222222222262626626668884686484686422222266668686868848866224888888888888888484844862', //Драконы запад с фармом уников.
            east: '6666246626262222222222222222242424424444444848484626266266688846864846864', // Драконы восток.
            east_alt: '666624662626222222222222222488662242242424424444444848484626266266688846864846864', // Драконы восток с фармом уников.
            north: '222222222222222226424626424622244448484846262662666666686868688888888888888888484844862', // Драконы центр.
            north_alt: '22222222222222222642462642462224444848484626266266666668686868848866224888888888888888484844864', // Драконы центр с фармом уников.
        },
        mysterious: '6688662266666666824444444488442244888866884488666622666666226666668844448844448866888866668866226682448844222266222248688866662266224422666622668888668888448866886884', // тайны
        // ниже подземки
        corsairs: { // Форд корсаров
            fromKorheim: '48866666666666668844844488888666888888888844',
            toKorheim: '66222222222244422222666266224444444444444226',
            fromNecropolis: '44488868844844488888666888888888844',
            toNecropolis: '66222222222244422222666266224222666',
        },
        // зацикленные маршруты подземок
        looped: {
            corsairs: '4884448844422222668886666226',
            2508: '86424462226686868866664242884422424242266286868666868688666222888444226442424424424284442262622266266448824424244826686884428668848442868884688886', // Крепость Чуждых Страхов
            4644: '4444222244888844224422664488668866222266666666884444666622442244668844448888668888886688668866888844442222448888222266888866662222222222444422886666888888442244224422222266668866222222224422662222444444666666884444884422468866226666884488668868888622228866886622224428668888442244448888442244', // Крепость Тайного Братства
            304497615: '68266266668888222244422466666444488488668888222244844688868822448888222444888222244882262226442448888222266224226444446666884448888222266668668262226888', // Цитадель Абсолютной Тьмы
            4306: '2222666666662222448862688844442244444488444444266662444426666244224444888822666666888866226666668844448888888888442222222248888422228844882222886688888844262444884488886666226644884444222266226666226688886666222266888888226688662222488842228844222266222244448862686268884444888844222222', // Цитадель Безликих Рабов
            304497594: '86424462226686868866664242884422424242266286868666868688666222888444226442424424424284442262622266266448824424244826686884428668848442868884688886', // Пристанище Темных Сил
            30112: '886688888888442624262422448888888866888888666666662244226666844486666666662444426666244442666622662222222222444444224444886644422488884488626862268866226666844486668842484248444444888888666622226666668842484426244444868486844488884222248888688444222222442222222266886622224422', // Цитадель Карнарона
        }
    }
    let increment = true;

    const getDragonsKey = async (iteration = 1) => {
        if (iteration > 10) {
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
                return state.world.highLair ? maps.dragons.west_alt : maps.dragons.west
            case 2:
                return state.world.highLair ? maps.dragons.east_alt : maps.dragons.east
            case 3:
                return state.world.highLair ? maps.dragons.north_alt : maps.dragons.north
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

    const teleportToLair = () => {
        const tpUrl = new URL(`${url.origin}${pathNames.lairLobby}${url.search}`);
        tpUrl.searchParams.set('exit', '1');
        tpUrl.searchParams.set('yes', '1');
        return tpUrl.href;
    }

    const goToUnderground = () => {
        const castleUrl = new URL(`${url.origin}${pathNames.castle}${url.search}`);
        castleUrl.searchParams.set('enterCastle', '1');
        castleUrl.searchParams.set('yes', '1');
        return castleUrl.href;
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
            if (type === "lair") {
                if (url.pathname === pathNames.index || searchLink(words.toCity)) {
                    return [teleportToLair()]
                }

                if (
                    (
                        url.pathname === pathNames.world
                        && (searchLink(words.toLairsLobby) || !searchLink(words.toCity))
                    )
                    || (searchLink(words.lairForsworn) && url.pathname === pathNames.lairLobby)
                ) {
                    return maps.empty;
                }
            }
            if (type === "castle" && checkText(words.castleName)) {
                return maps.empty;
            }
            if (type === "arena" && checkText(words.arena)) {
                return maps.empty;
            }
            if (type === "corsairs" && checkText(words.corsairs)) {
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
        if (state.world.returned) {
            return [
                [words.leaveLairsLobby, words.yes],
                maps.lair[user.getBack()],
                [words.toCity]
            ]
        }

        return [
            [words.leaveLairsLobby, words.yes]
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

    const checkCompleteQuest = async () => {
        if (!state.global.clan_id) return false;

        const clanUrl = new URL(`${url.origin}${pathNames.clan}${url.search}`);
        clanUrl.searchParams.set("id", state.global.clan_id);
        clanUrl.searchParams.set("missions", "1");
        clanUrl.searchParams.set("quest", "21");

        const response = await fetch(clanUrl.href);
        if (response.ok) {
            const text = await response.text();
            const div = document.createElement("div");
            div.innerHTML = text;
            const link = searchLink(words.questClanComplete, div);
            if (link) {
                link.click();
                clanUrl.searchParams.set("get", "1");
                await fetch(clanUrl.href);
            }
            return true;
        }
        return false;
    }

    const isArena = checkText(words.arenaLvl) && +state.world.map === 7;

    const isCastleUnderground = checkText(words.checkCastleTime);

    if (checkText(words.captcha)) {
        return await solve();
    } else {
        if (isArena) {
            arenaLogic();
        }

        if (checkText(words.failLvlLair) || checkText(words.failTimeLair)) {
            dropMap();
        }

        if (!isArena && !isCastleUnderground) {
            if (state?.world && state?.move) {
                if ((state.world.attack && !checkText("Север:")) || state.world.attackAll) {
                    const link = searchLink(words.toAttack) || searchLink(words.inBattle);
                    if (link) {
                        if (isCastleUnderground) {
                            await checkCompleteQuest();
                        }
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
                            9: [
                                info.getForward("corsairs"),
                                [goToUnderground()],
                                maps.looped.corsairs,
                                [words.toCity]
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
                        if (!isCastleUnderground) {
                            state.move.active += 1;
                        }
                        state.move.step = 0;
                        updateState({move: state.move});
                        setTimeout(refresh, delay.long);
                    } else {
                        dropMap();
                    }
                }
            } else {
                wait();
            }
        }
    }
});

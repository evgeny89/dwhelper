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
        leprechaun: {
            "Дреднайты": '88844444444444444488888888868822222222222226288888888888888886882222222222222222222262888888888888888888888868222222222222222222222222628888888888888888888888888866866824224426242264222222222222222222222628888888888888888888822622222222222222222262888888888888888888226222222222222222268888888888888882622222222222222268888888888888868222222222222222688888888888888262222222222222688888888888882622222222222288868888888888262222222286888882262844444444',
            "Темплары": '8888888866644444424466666666666266444444444444266666666666666264444444444444444266666666666666666264444444444444444444266666666666666666666244444444444444444444462666666666666666666666264444444444444444444444626666666666666666666662644444444444444444444444662666666666666666666666244444444444444444444626666666666666666666244444444444444446628662666666666666244444444444626666666666244444444446266666666244444444626666662444444462666662444442466666424444246666424444242424668686688668888888888888888888444444444488',
            teleports: {
                "Дреднайты": {
                    '304495774': [
                        '66222222666666222222226688886622222244442244442222444444',
                        [words.teleports.upToServantSquare],
                    ],
                    '304497318': [
                        '222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888884488888888884444224444884444444444226622222266224422222222224444442222222222222222224422224444444444444444',
                        [words.teleports.upToServantSquare],
                    ],
                },
                "Темплары": {
                    '304495774': [
                        '662222226666662222222266888866668888888888886688888866668844886688866888448866666666662266668866662222222222668888888888',
                        [words.teleports.upToServantSquare],
                    ],
                    '304497318': [
                        '222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888888888888888',
                        [words.teleports.upToServantSquare],
                    ],
                },
            },
        },
        farming: {
            '60': '2222222666666666666844444444444866666666668444444444486666666666844444444448666666666668444444444444',
            '65': '444444444442666666666624444444444426666666666624444444444442666666666866668888',
            '68': '222222222688888888862222222226888888888622222222262222266666666844444448666666668444444448666666666844444444488888888862222222268888888862222222268888888862222222268888888884444444444442',
        },
        toFarming65: {
            fromKorheim: [
                [words.teleports.underKorheim],
                '4448484844848844884848448844444888884484848442242244',
                [words.teleports.upTo202],
                '886886666666666888888886666662',
            ],
            fromNecropolis: [
                '444888444444444444226',
                [words.teleports.underKorheim],
                '4448484844848844884848448844444888884484848442242244',
                [words.teleports.upTo202],
                '886886666666666888888886666662',
            ],
            teleports: {
                '202': ['886666666668888886666668'],
                '8276': ['6'],
            },
        },
        toFarming68: {
            fromKorheim: [
                [words.teleports.underKorheim],
                '4448484844848844884848448844444888884484848442242244',
                [words.teleports.upTo202],
                '88688666666666688444448888888888888888888888866666',
            ],
            fromNecropolis: [
                '444888444444444444226',
                [words.teleports.underKorheim],
                '4448484844848844884848448844444888884484848442242244',
                [words.teleports.upTo202],
                '88688666666666688444448888888888888888888888866666',
            ],
            teleports: {
                '202': ['8866666666688888884444488888888888888888866666'],
                '8276': ['444444444488888888888888888866666'],
                '9982': ['86666666'],
            },
        },
        toFarming60: {
            fromKorheim: [
                '444',
                [words.teleports.underForestOfFerns],
                '888888888888888888666666666',
            ],
            fromNecropolis: [
                '444',
                [words.teleports.underForestOfFerns],
                '888888888888888888666666666',
            ],
        },
        elementals: { // Замок Элементалей
            fromKorheim: ['48888888888848886'],
            fromNecropolis: ['44488844444444444488888888848886'],
        },
        corsairs: { // Форд корсаров
            fromKorheim: ['48866666666666668844844488888666888888888844'],
            fromNecropolis: ['44488868844844488888666888888888844'],
        },
        independence: { // Форт Независимости
            fromKorheim: ['48844444448442222222222444442222222'],
            fromNecropolis: ['44488844444444444444444448442222222222444442222222'],
            teleports: {
                '630': ['662'],
            },
        },
        eternal: { // Замок Вечной Тьмы
            fromKorheim: [
                [words.teleports.underKorheim],
                '4442424244222222444242222666'
            ],
            fromNecropolis: [
                '444888444444444444226',
                [words.teleports.underKorheim],
                '4442424244222222444242222666'
            ],
        },
        brotherhood: { // Крепость Тайного Братства
            fromKorheim: [
                [words.teleports.underKorheim],
                '22226266262224222226262222222666622622226'
            ],
            fromNecropolis: [
                '444888444444444444226',
                [words.teleports.underKorheim],
                '22226266262224222226262222222666622622226'
            ],
        },
        fears: { // Крепость Чуждых Страхов
            fromKorheim: ['488666666666666666666666222222222222222222222222'],
            fromNecropolis: ['666666222222222222222222222'],
        },
        paladins: { // Пристанище Паладинов
            fromKorheim: null,
            fromNecropolis: null,
            teleports: {
                '304495774': ['662222226666662222222266888866668888888888886688888866668844886688884444'],
                '304497318': ['22222222666622444422226666226666222222444444222222222222666622666688888888888888888888888888888888448888888888444422444488444444444422662224484444'],
            },
        },
        forces: { // Пристанище Темных Сил
            fromKorheim: null,
            fromNecropolis: null,
            teleports: {
                '304495774': ['66222222666666222222226688886666888888888888668888886666884488668886688844886666666666226666886666222222222266222222222222222222222222222222224444884444888888888866666622224444222266'],
                '304497318': ['2222222266662244442222666622666622222222224444222266'],
            },
        },
        hermits: { // Цитадель Отшельников Крови
            fromKorheim: '4886666666666662222222222222224444',
            fromNecropolis: '4442222222222224444',
        },
        slaves: { // Цитадель Безликих Рабов
            fromKorheim: [[words.teleports.underKorheim], '2222626626222'],
            fromNecropolis: ['444888444444444444226', [words.teleports.underKorheim], '2222626626222'],
        },
        carnaron: { // Цитадель Карнарона
            fromKorheim: null,
            fromNecropolis: null,
            teleports: {
                "Дреднайты": {
                    '304495774': [
                        '66222222666666222222226688886622222244442244442222444444',
                        [words.teleports.upToServantSquare],
                        '222266666666',
                    ],
                    '304497318': [
                        '222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888884488888888884444224444884444444444226622222266224422222222224444442222222222222222224422224444444444444444',
                        [words.teleports.upToServantSquare],
                        '222266666666',
                    ],
                },
                "Темплары": {
                    '304495774': [
                        '662222226666662222222266888866668888888888886688888866668844886688866888448866666666662266668866662222222222668888888888',
                        [words.teleports.upToServantSquare],
                        '66666666622222222222222222222444',
                    ],
                    '304497318': [
                        '222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888888888888888',
                        [words.teleports.upToServantSquare],
                        '66666666622222222222222222222444',
                    ],
                },
            },
        },
        maurac: { // Цитадель Маурака
            fromKorheim: null,
            fromNecropolis: null,
            teleports: {
                "Дреднайты": {
                    '304495774': [
                        '66222222666666222222226688886622222244442244442222444444',
                        [words.teleports.upToServantSquare],
                        '444444448888888888888888888666',
                    ],
                    '304497318': [
                        '222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888884488888888884444224444884444444444226622222266224422222222224444442222222222222222224422224444444444444444',
                        [words.teleports.upToServantSquare],
                        '444444448888888888888888888666',
                    ],
                },
                "Темплары": {
                    '304495774': [
                        '662222226666662222222266888866668888888888886688888866668844886688866888448866666666662266668866662222222222668888888888',
                        [words.teleports.upToServantSquare],
                        '8884444444',
                    ],
                    '304497318': [
                        '222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888888888888888',
                        [words.teleports.upToServantSquare],
                        '8884444444',
                    ],
                },
            },
        },
        white: { // Цитадель Ослепляющей Белизны
            fromKorheim: null,
            teleports: {
                '304495774': ['662222226666666688888888844'],
                '304497318': ['222222226666224444222266662266662222224444442222222222226666226666888888888888888888888888888888884488888888884444224444884444444444444444444422222244442244444422222222666622226688866'],
            },
        },
        absolute: { // Цитадель Абсолютной Тьмы
            fromKorheim: null,
            fromNecropolis: null,
            teleports: {
                '304495774': ['662222226666662222222266888866668888888888886688888866668844886688866888448866666666662266668866662222222222662222222222222222222222222222222244448844448888888888666666888888444488444488886666668'],
                '304497318': ['222222226666662'],
            },
        },
        // зацикленные маршруты подземок
        looped: {
            elementals: '28',
            corsairs: '4884448844422222668886666226',
            independence: '2424484224442226848866662222486888866868',
            eternal: '24444886664448866668668244822444488668866664444224488422448844446666226622444484482668226666224446662244448266662244424488488882642226222246648866866622442866268662844886662662246648888688882462224224484448866668', // Замок Вечной Тьмы
            brotherhood: '2244884422244222682668866682226666884428668844468886688866666482222244668844668844448888826444844662228442446686686622222484422444288844442266824422666666', // Крепость Тайного Братства
            fears: '86424462226686868866664242884422424242266286868666868688666222888444226442424424424284442262622266266448824424244826686884428668848442868884688886', // Крепость Чуждых Страхов
            paladins: '44884224222444864886668882448486846866286684484448864866622266648868626826224666888666246224442442666626242642448882444848882224244662686242226688662426666222482448884422424842848866', // Пристанище Паладинов
            forces: '2222666666662222448862688844442244444488444444266662444426666244224444888822666666888866226666668844448888888888442222222248888422228844882222886688888844262444884488886666226644884444222266226666226688886666222266888888226688662222488842228844222266222244448862686268884444888844222222', // Пристанище Темных Сил
            hermits: '488644284886868866664246222866288688262424444444444488686642442246262226262244482286622244286688868662224226666842444886866666222864888682268888848682626424222244444448866688682642424444484848888662262626', // Цитадель Отшельников Крови
            slaves: '68266266668888222244422466666444488488668888222244844688868822448888222444888222244882262226442448888222266224226444446666884448888222266668668262226888', // Цитадель Безликих Рабов
            carnaron: '886688888888442624262422448888888866888888666666662244226666844486666666662444426666244442666622662222222222444444224444886644422488884488626862268866226666844486668842484248444444888888666622226666668842484426244444868486844488884222248888688444222222442222222266886622224422', // Цитадель Карнарона
            maurac: '6886622226684866622668486662288668866888888886622222288888888448844448866448844224444886644226622664422224422666688886624266688222222288844222248884222488884262426244422666666444444888844224444228844888888668844668822668866662248422244668884244422224266862244442266666224224', // Цитадель Маурака
            white: '844448466884888444422662424688488688848888664242226266888426224226626688848888486624226668882668666642484424422622686826686824244448444422662626628668664244444844226262666686226284844422266628448488442444226662', // Цитадель Ослепляющей Белизны
            absolute: '4444222244888844224422664488668866222266666666884444666622442244668844448888668888886688668866888844442222448888222266888866662222222222444422886666888888442244224422222266668866222222224422662222444444666666884444884422468866226666884488668868888622228866886622224428668888442244448888442244', // Цитадель Абсолютной Тьмы
        }
    }
    const castleTypes = [
        'elementals',
        'corsairs',
        'independence',
        'eternal',
        'brotherhood',
        'fears',
        'paladins',
        'forces',
        'hermits',
        'slaves',
        'carnaron',
        'maurac',
        'white',
        'absolute',
    ];
    const bossesInCastles = [
        'Убийственный Мрак',
        'Болотное Отродье',
        'Призрачный Генерал',
        'Пожиратель Падальщиков',
        'Убийца Песков',
        'Повешанный Висильник',
        'Каменный Гигант',
        'Демон Храма',
    ];
    const leprechaunWord = "Лепрекон";
    let increment = true;

    const getLocation = () => {
        const [, location] = extractText('(?<=<div class="main">\\[)(\\d+)(?=].+<\\/div>)');
        return location
    }

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

    const getLeprechaunRoute = (side) => {
        if (side !== "Дреднайты" && side !== "Темплары") {
            notify(messages.notDetectSide);
            dropMap();
        }
        if (!checkText(words.leprechaun[side]) && !checkText(words.castles.cloudOfLight) && !checkText(words.castles.cloudOfDarkness)) {
            notify(messages.withoutMap);
            dropMap();
        }

        const location = getLocation()

        if (maps.leprechaun.teleports[side]?.[location]) {
            return [
                ...maps.leprechaun.teleports[side]?.[location],
                maps.leprechaun[side]
            ]
        }

        return [maps.leprechaun[side]]
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
            if (type === "toFarming") {
                if (url.pathname !== pathNames.index && !searchLink(words.toCity)) {
                    notify(messages.needToBeCity);
                    dropMap();
                    return;
                }
            }
            if (castleTypes.includes(type) && checkText(words.castles[type])) {
                return maps.empty;
            }

            switch (this.city) {
                case "Корхейм":
                    if (maps[type].fromKorheim) return maps[type].fromKorheim;
                    if (!castleTypes.includes(type)) return maps.empty;
                    notify(messages.withoutMap);
                    dropMap();
                    break;
                case "Некрополь":
                    if (maps[type].fromNecropolis) return maps[type].fromNecropolis;
                    if (!castleTypes.includes(type)) return maps.empty;
                    notify(messages.withoutMap);
                    dropMap();
                    break;
                default:
                    notify(messages.notDetectCity);
                    dropMap();
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
        if (!state.world.infinityArena && leaveArena()) {
            searchLink(words.leaveLairsLobby)?.click();
        }

        const link = searchLink(words.toAttack);

        if (link && (state.world.attack || state.world.attackAll)) {
            link.click();
        } else {
            wait(20);
        }
    }

    const fetchCompleteQuest = async (uri, params, tries = 0) => {
        if (tries > 10) {
            notify(messages.questPageNotAvailable)
            return false
        }
        const response = await fetch(uri);
        if (response.ok) {
            const text = await response.text();
            if (/href="\/clan\.php\?.*UIN.+UIN.+"/.test(text)) {
                await timeout(delay.fast)
                await fetchCompleteQuest(uri, params, ++tries)
            }
            debug(text);
            if (/clan\.php\?missions=1&amp;quest=21&amp;end=1/.test(text)) {
                params.set("end", "1");
                await fetch(`${url.origin}${pathNames.clan}?${params.toString()}`);
                await timeout(delay.fast)
                params.delete('end');
                params.set("get", "1");
                await fetch(`${url.origin}${pathNames.clan}?${params.toString()}`);
            }
            return true;
        }
        return false;
    }

    const checkCompleteQuest = async () => {
        if (!state.user.clan_id) return false;

        const searchParams = new URLSearchParams(url.search);
        searchParams.delete('loc');
        searchParams.set("id", state.user.clan_id);
        searchParams.set("missions", "1");
        searchParams.set("quest", "21");

        const questUrl = `${url.origin}${pathNames.clan}?${searchParams.toString()}`;
        return await fetchCompleteQuest(questUrl, searchParams);
    }

    const checkBosses = () => {
        const block = document.querySelector('.block');
        return bossesInCastles.some((mob) => checkText(mob, block))
    }

    const countMobsInLocation = () => {
        const matches = document.body.innerHTML.matchAll(/\[(\d+) особей]/g)
        const count = matches.reduce((acc, match) => acc + +match[1], 0)
        return count >= settings.minMobsValue
    }

    const needAttack = (isUnder) => {
        switch (true) {
            case state.world.attack && !checkText(words.checkSteps):
            case state.world.attackAll:
            case +state.world.map === 9 && checkText(leprechaunWord):
            case isUnder && state.castle.attackBoss && checkBosses():
            case state.world.manyMobs && countMobsInLocation():
                return true;
            default:
                return false;
        }
    }

    const checkLopperRoute = () => {
        switch (true) {
            case +state.world.map === 9:
                return state.move.active === state.move.routes.length - 3;
            case +state.world.map >= 20:
                return state.move.active === state.move.routes.length - 2;
            case ['10', '11', '12', '13'].includes(state.world.map):
                return state.move.active === state.move.routes.length - 1;
            default:
                return false;
        }
    }

    const tryTeleportationMap = (type, userInfo = null) => {
        const location = getLocation()

        switch (true) {
            case !!maps[type]?.teleports?.[location]:
                return maps[type]?.teleports?.[location]
            case !!maps[type]?.teleports?.[state.user.side]?.[location]:
                return maps[type]?.teleports?.[state.user.side]?.[location]
            case userInfo instanceof UserInfo:
                return userInfo.getForward(type)
            default:
                notify(messages.withoutMap);
                dropMap();
                return maps.empty
        }
    }

    const goToUnderground = () => {
        const castleUrl = new URL(`${url.origin}${pathNames.castle}${url.search}`);
        castleUrl.searchParams.set('enterCastle', '1');
        castleUrl.searchParams.set('yes', '1');
        return castleUrl.href;
    }

    const getCastleUndergroundRoutes = (info, type) => {
        return [
            ...tryTeleportationMap(type, info),
            [goToUnderground()],
            maps.looped[type],
            [words.toCity]
        ]
    }

    const isArena = checkText(words.arenaLvl) && +state.world.map === 7;

    const isCastleUnderground = checkText(words.checkCastleTime);

    if (checkText(words.captcha)) {
        return await solve();
    } else {
        if (checkText(words.failLvlLair) || checkText(words.failTimeLair)) {
            dropMap();
        }

        if (isArena) {
            arenaLogic();
        } else {
            if (state?.world && state?.move) {
                if (needAttack(isCastleUnderground)) {
                    const link = searchLink(words.toAttack) || searchLink(words.inBattle);
                    if (link) {
                        if (isCastleUnderground && state.castle.checkUndergroundQuest) {
                            await checkCompleteQuest();
                        }
                        increment = false;
                        link.click();
                    }
                }

                if (+state.world.map && !state.move.routes.length) {
                    await (async () => {
                        const info = await UserInfo.getUserData();

                        switch (+state.world.map) {
                            case 1:
                                state.move.routes = [
                                    info.getForward("lair"),
                                    checkInLair(words.lairForsworn, info),
                                    maps.fallen,
                                    ...pathBack(info),
                                ]
                                break;
                            case 2:
                                state.move.routes = [
                                    info.getForward("lair"),
                                    checkInLair(words.lairFallen, info),
                                    maps.fallen,
                                    ...pathBack(info),
                                ]
                                break;
                            case 3:
                                state.move.routes = [
                                    info.getForward("lair"),
                                    checkInLair(words.lairDragon, info),
                                    maps.dragons.entry,
                                    'chooseDragonPath',
                                    ...pathBack(info),
                                ]
                                break;
                            case 4:
                                state.move.routes = [
                                    info.getForward("lair"),
                                    checkInLair(words.lairMysterious, info),
                                    maps.mysterious,
                                    ...pathBack(info),
                                ]
                                break;
                            case 5:
                                state.move.routes = [
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
                                ]
                                break;
                            case 6:
                                state.move.routes = [
                                    info.getForward("castle"),
                                    [words.castleName],
                                    maps.castle[info.getBack()],
                                    [words.toCity]
                                ]
                                break;
                            case 7:
                                state.move.routes = [
                                    info.getForward("arena"),
                                    [words.arena],
                                    [words.yes],
                                    maps.lair[info.getBack()],
                                    [words.toCity]
                                ]
                                break;
                            case 8:
                                state.move.routes = [
                                    info.getForward("lair"),
                                    checkInLair(words.lairFallen, info),
                                    maps.fallen,
                                    [words.leaveLairsLobby, words.yes],
                                    checkInLair(words.lairDragon, info),
                                    maps.dragons.entry,
                                    'chooseDragonPath',
                                    ...pathBack(info),
                                ]
                                break;
                            case 9:
                                state.move.routes = [
                                    ...getLeprechaunRoute(state.user.side),
                                    [words.giveUp],
                                    [words.toCity],
                                ]
                                break;
                            case 10:
                                state.move.routes = [
                                    [teleportToLair()],
                                    ...info.getForward("toFarming60"),
                                    maps.farming["60"],
                                ]
                                break;
                            case 11:
                                state.move.routes = [
                                    ...tryTeleportationMap("toFarming65", info),
                                    maps.farming["65"],
                                ]
                                break;
                            case 12:
                                state.move.routes = [
                                    ...tryTeleportationMap("toFarming68", info),
                                    maps.farming["68"],
                                ]
                                break;
                            case 13:
                                state.move.routes = getLeprechaunRoute(state.user.side)
                                break;
                            // ниже подземки
                            case 21:
                                state.move.routes = getCastleUndergroundRoutes(info, "elementals")
                                break;
                            case 22:
                                state.move.routes = getCastleUndergroundRoutes(info, "corsairs")
                                break;
                            case 23:
                                state.move.routes = getCastleUndergroundRoutes(info, "independence")
                                break;
                            case 24:
                                state.move.routes = getCastleUndergroundRoutes(info, "eternal")
                                break;
                            case 26:
                                state.move.routes = getCastleUndergroundRoutes(info, "brotherhood")
                                break;
                            case 27:
                                state.move.routes = getCastleUndergroundRoutes(info, "fears")
                                break;
                            case 28:
                                state.move.routes = getCastleUndergroundRoutes(info, 'paladins')
                                break;
                            case 29:
                                state.move.routes = getCastleUndergroundRoutes(info, 'forces')
                                break;
                            case 33:
                                state.move.routes = getCastleUndergroundRoutes(info, 'hermits')
                                break;
                            case 34:
                                state.move.routes = getCastleUndergroundRoutes(info, "slaves")
                                break;
                            case 36:
                                state.move.routes = getCastleUndergroundRoutes(info, "carnaron")
                                break;
                            case 37:
                                state.move.routes = getCastleUndergroundRoutes(info, "maurac")
                                break;
                            case 38:
                                state.move.routes = getCastleUndergroundRoutes(info, "white")
                                break;
                            case 39:
                                state.move.routes = getCastleUndergroundRoutes(info, "absolute")
                                break;
                            default:
                                dropMap();
                        }
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
                                    setLastMap(+state.world.map)
                                    dropMap();
                                }
                                searchLink(currentStep)?.click();
                            }, delay.none)
                        } else if (checkText(words.checkSteps)) {
                            if (+state.world.map >= 20 && state.move.active === state.move.routes.length - 2 && !isCastleUnderground) {
                                toNextRoute(delay.fiveSeconds);
                            } else {
                                updateStepInState();
                                setTimeout(doStep, delay.none, currentStep);
                            }
                        }
                    } else if (+state.world.map && (state.move.routes[state.move.active + 1] !== undefined || checkLopperRoute())) {
                        if (!checkLopperRoute()) {
                            state.move.active += 1;
                        }
                        state.move.step = 0;
                        updateState({move: state.move});
                        setTimeout(refresh, delay.fast);
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

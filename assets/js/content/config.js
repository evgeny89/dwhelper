const settings = {
    drawLifePoints: 10000, // юзать вытяжку если не хватает указанного количества HP
    minMobsValue: 7,
}

const words = {
    arena: "Вход на Арену",
    clanArena: "Вход на Клановую Арену",
    arenaLvl: "Вы на Арене Грез, уровень:",
    captcha: "Введите код",
    castleName: "Великая Русь",
    checkCastleTime: "Осталось времени в подземелье:",
    changeEnemy: "Сменить",
    chemist: "Главный Химик Лаборатории Самарсиан",
    chemistImpaired: "Ослабленный Главный Химик Лаборатории Самарсиан",
    craftCount: "Осталось:",
    craftItem: "Вы изготавливаете предмет:",
    craftTime: "До очередного предмета: (\\d{2}):(\\d{2}):(\\d{2})",
    defeat: "Поражение",
    errorBattlefieldText: "Нельзя двигаться чаще 1 движения в 5 секунд",
    errorText: "В данной локации отсутствуют ресурсы!",
    failLvlLair: "Вы или кто-то из Вашей группы не подходите по уровню!",
    failTimeLair: "У Вас или кого-то из Вашей группы не истекло время запрета на повторный заход в Логово!",
    forgedItem: "Вещь заточена",
    fromFolderTextLink: "Из отдела",
    getLinkText: "Добыть",
    gotToLand: "В земли грез",
    help: "Помочь",
    inArena: "Вы на Арене Грез",
    inBattle: "В бой",
    inCastleFail: "Подземелье замка",
    inChestText: "В рюкзак",
    inventoryLinkText: "Инвентарь",
    inWorld: "В Земли",
    //killMobs: "Я уничтожил (\\d{1,3}) монстров в подземельях",
    leaveCastle: "Покинуть Подземелье",
    leaveLairsLobby: "Покинуть Логово",
    lairDragon: "Пещера Драконов",
    lairForsworn: "Подземелья Изгоев",
    lairFallen: "Подземелья Падших",
    lairMysterious: "Таинственные Земли",
    notForgeItemsText: "Извините, но вам нечего затачивать",
    outChestText: "Из рюкзака",
    questClanComplete: "\\[Завершить]",
    questClanStart: "Я сделаю это!",
    receiveLinkText: "Забрать",
    refreshLinkText: "Обновить",
    saleItemText: "продать за",
    saleSuccessText: "Вы успешно продали",
    teamVictoryText: "Победила команда номер \\d",
    toAttack: "\\[Битва]",
    toBattleField: "На Поле Битвы",
    toCity: "В город",
    toFolderLinkText: "В отдел",
    toFolderText: "Выберите отдел",
    toForge: "Точить вещь",
    toLairsLobby: "Вход в Логова",
    toMainLinkText: "На главную",
    yes: "Да",
    castles: {
        elementals: '\\[1472] Остров Магов',
        corsairs: "\\[1938] Восточная Роща",
        independence: "\\[731] Холодный Берег",
        eternal: '\\[3689] Подземелье',
        brotherhood: "\\[4644] Подземелье",
        fears: "\\[2508] Дремучий лес",
        forces: "\\[304497594] Призрачное поле",
        paladins: "\\[304496606] Призрачное поле",
        slaves: "\\[4306] Подземелье",
        hermits: "\\[4306] Подземелье",
        carnaron: "\\[30112]",
        maurac: "\\[32422]",
        white: "\\[304496185] Призрачное поле",
        absolute: "\\[304497615] Призрачное поле",
    },
    teleports: {
        underKorheim: "Подземный Вход В Корхейм",
        upKorheim: "Корхейм",
        underBairem: "Подземные Врата Байрема",
        upBairem: "Бейрем",
    }
}

const pathNames = {
    battles: "/battle_group.php",
    battlefield: "/battleground.php",
    buff: "/buff.php",
    castle: "/world/castle.php",
    clan: "/clan.php",
    workshop: "/craft.php",
    events: "/service_events.php",
    forge: "/forge.php",
    inventory: "/inventory.php",
    index: "/index.php",
    lairLobby: "/world/dungeon.php",
    leader: "/leader.php",
    parcels: "/parcels.php",
    resources: "/world/resource.php",
    skills: "/skill_learn.php",
    user: "/user.php",
    world: "/world/world.php",
    item: "/item.php",
}

const delay = {
    none: 0,
    fast: 100,
    third: 200,
    long: 1000,
    fiveSeconds: 5000,
    tenSeconds: 10000,
    halfMinute: 30000,
    minute: 60000,
    twoMinutes: 120000,
    fiveMinutes: 300000,
    tenMinutes: 600000,
}

const api = {
    capMonster: {
        createTaskUrl: "https://api.capmonster.cloud/createTask",
        getResultUrl: "https://api.capmonster.cloud/getTaskResult",
    },
    ruCaptcha: {
        createTaskUrl: "https://rucaptcha.com/in.php",
        getResultUrl: "https://rucaptcha.com/res.php",
    },
    antiCaptcha: {
        createTaskUrl: "https://api.anti-captcha.com/createTask",
        getResultUrl: "https://api.anti-captcha.com/getTaskResult",
    },
}

const messages = {
    captcha: "Пожалуйста, введите код",
    notMoney: "У Вас недостаточно средств",
    installed: "Расширение успешно обновлено",
    parseFlasksError: "Ошибка сканирования одетых вещей",
    parseForgeError: "Ошибка сканирования доступных вещей",
    parseEmptyItems: "Список доступных вещей пуст",
    parseSkillsError: "Ошибка сканирования навыков",
    battlefieldComplete: "Карта поля битв завершена.",
    withoutMap: "Маршрут отсутствует. Необходимо самим добраться до локации указанного замка и запустить маршрут заново",
    questPageNotAvailable: "Страница кланового задания недоступна",
}

const debugTypes = {
    show: "show",
    copy: "copy",
}

const quests = {
    arena: [16, 17]
}

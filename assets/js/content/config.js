const words = {
    arena: "Вход на Арену",
    clanArena: "Вход на Клановую Арену",
    arenaLvl: "Вы на Арене Грез, уровень:",
    changeEnemy: "Сменить",
    captcha: "Введите код",
    castleName: "Великая Русь",
    defeat: "Поражение",
    errorText: "В данной локации отсутствуют ресурсы!",
    failLvlLair: "Вы или кто-то из Вашей группы не подходите по уровню!",
    failTimeLair: "У Вас или кого-то из Вашей группы не истекло время запрета на повтороный заход в Логово!",
    fromFolderTextLink: "Из отдела",
    getLinkText: "Добыть",
    gotToLand: "В земли грез",
    help: "Помочь",
    inArena: "Вы на Арене Грез",
    inBattle: "В бой",
    inChestText: "В рюкзак",
    inventoryLinkText: "Инвентарь",
    inWorld: "В Земли",
    leaveLairsLobby: "Покинуть Логово",
    lairDragon: "Пещера Драконов",
    lairForsworn: "Подземелья Изгоев",
    lairFallen: "Подземелья Падших",
    lairMysterious: "Таинственные Земли",
    notForgeItemsText: "Извините, но вам нечего затачивать",
    outChestText: "Из рюкзака",
    receiveLinkText: "Забрать",
    refreshLinkText: "Обновить",
    saleItemText: "продать за",
    saleSuccessText: "Вы успешно продали",
    toAttack: "Битва",
    toCity: "В город",
    toFolderLinkText: "В отдел",
    toFolderText: "Выберите отдел",
    toForge: "Точить вещь",
    toLairsLobby: "Вход в Логова",
    yes: "Да",
}

const pathNames = {
    battles: "/battle_group.php",
    battlefield: "/battleground.php",
    battleground: "/battleground.php",
    buff: "/buff.php",
    castle: "/world/castle.php",
    events: "/service_events.php",
    inventory: "/inventory.php",
    index: "/index.php",
    lairLobby: "/world/dungeon.php",
    parcels: "/parcels.php",
    quest: "/leader.php",
    resources: "/world/resource.php",
    skills: "/skill_learn.php",
    user: "/user.php",
    world: "/world/world.php",
    item: "/item.php",
}

const delay = {
    fast: 0,
    long: 1000,
    fiveSeconds: 5000,
    tenSeconds: 10000,
    waitHalfMinutes: 30000,
    waitMinutes: 60000,
    waitTwoMinutes: 120000,
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
}

const debugTypes = {
    show: "show",
    copy: "copy",
}

const quests = {
    arena: [16, 17]
}

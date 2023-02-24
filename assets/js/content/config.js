const words = {
    arena: "Вход на Арену",
    captcha: "Введите код",
    castleName: "Великая Русь",
    defeat: "Поражение",
    errorText: "В данной локации отсутствуют ресурсы!",
    failLvlLair: "Вы или кто-то из Вашей группы не подходите по уровню!",
    failTimeLair: "У Вас или кого-то из Вашей группы не истекло время запрета на повтороный заход в Логово!",
    getLinkText: "Добыть",
    gotToLand: "В земли грез",
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
    castle: "/world/castle.php",
    events: "/service_events.php",
    inventory: "/inventory.php",
    lairLobby: "/world/dungeon.php",
    parcels: "/parcels.php",
    resources: "/world/resource.php",
    skills: "/skill_learn.php",
    user: "/user.php",
    world: "/world/world.php",
}

const delay = {
    fast: 300,
    long: 1000,
    waitMinutes: 60000,
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
}

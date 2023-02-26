// state
let state = {}

const noteTime = {
    success: 1500,
    error: 3000,
}

const icons = {
    ok: '<span uk-icon=\'icon: check\'></span>',
    err: '<span uk-icon=\'icon: warning\'></span>',
}

const elementsType = {
    'checkbox': 'checked',
    'radio': 'value',
    'text': 'value',
    'select': 'selectedIndex'
}

const popup = document.querySelector('#popup');

const elements = popup.querySelectorAll('[data-state]');

// functions ------------------------------------------------------------------------>
function updateState(payload, type = 'update') {
    chrome.runtime.sendMessage({action: 'set-state', type, payload});
}

const showSuccessMessage = (message) => {
    UIkit.notification({
        message: `${icons.ok} ${message}`,
        pos: 'top-right',
        status: 'success',
        timeout: noteTime.success,
    })
}

const showErrorMessage = (message) => {
    UIkit.notification({
        message: `${icons.err} ${message}`,
        pos: 'top-right',
        status: 'warning',
        timeout: noteTime.error,
    })
}

const setSelectOptions = (folders) => {
    const select = popup.querySelector('select[data-state="inventory_actions.to_folders"]');

    for (const item in folders) {
        const el = document.createElement('option');
        el.value = folders[item].id;
        el.textContent = folders[item].name;
        select.insertAdjacentElement('beforeend', el);
    }
}

const addSkillListUsage = (skills) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('uk-column-1-3', 'uk-margin');

    for (const item in skills) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const el = document.createElement('p')

        el.classList.add('uk-margin-small')

        input.classList.add('uk-checkbox', 'uk-margin-small-right');
        input.type = 'checkbox';
        input.dataset.state = `skills.${item}.value`;
        input.checked = skills[item].value

        label.innerText = skills[item].name

        label.insertAdjacentElement('afterbegin', input)
        el.insertAdjacentElement('beforeend', label)
        wrapper.insertAdjacentElement('beforeend', el);
    }

    return wrapper;
}

const getSelectFromGroupSkills = (key) => {
    const options = [
        {value: 0, name: 'не задано'},
        {value: 1, name: '1я группа'},
        {value: 2, name: '2я группа'},
    ];

    const select = document.createElement('select');
    select.dataset.state = `skills.${key}.group`;

    options.forEach(item => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = item.name;

        if (option.value === state.skills[key].group) {
            option.selected = true;
        }

        select.insertAdjacentElement('beforeend', option)
    })

    UIkit.formCustom(select);

    return select;
}

const addSkillListGroups = (skills) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('uk-column-1-2', 'uk-margin');

    for (const item in skills) {
        const itemElement = document.createElement('div');
        const customSelectElement = document.createElement('div');

        itemElement.classList.add('uk-flex');
        customSelectElement.classList.add('uk-margin-small-right');
        customSelectElement.setAttribute('uk-form-custom', 'target: > * > span:last-child');

        const selectElement = getSelectFromGroupSkills(item);

        customSelectElement.insertAdjacentElement('beforeend', selectElement);
        customSelectElement.insertAdjacentHTML('beforeend',
            `<span class="uk-link">
                    <span uk-icon="icon: pencil"></span>
                    <span></span>
                 </span>`);

        itemElement.insertAdjacentElement('beforeend', customSelectElement)
        itemElement.insertAdjacentHTML('beforeend', `<p class="uk-margin-remove">${state.skills[item].name}</p>`)

        wrapper.insertAdjacentElement('beforeend', itemElement);
    }

    return wrapper;
}

const addSkillsControls = (skills) => {
    const list = popup.querySelector('#skills');
    const groups = popup.querySelector('#skills-group');

    if (!Object.keys(skills).length) {
        list.innerText = "Отсканируйте умения";
        groups.innerText = "Отсканируйте умения";
        return;
    }

    list.innerHTML = "";
    list.insertAdjacentElement('beforeend', addSkillListUsage(skills));
    const listControls = list.querySelectorAll('[data-state]');
    listControls.forEach(item => {
        item.addEventListener('change', function (e) {
            const [property, subProperty, field] = e.target.dataset.state.split('.');
            state[property][subProperty][field] = e.target[elementsType[e.target.type]];
            updateState({name: property, value: {...state[property]}});
        });
    })

    groups.innerHTML = "";
    groups.insertAdjacentElement('beforeend', addSkillListGroups(skills));
    const groupsControls = groups.querySelectorAll('[data-state]');
    groupsControls.forEach(item => {
        item.addEventListener('change', (e) => {
            const uiSelect = UIkit.formCustom(e.target);
            const index = uiSelect.$el.options.selectedIndex;
            const [property, subProperty, field] = e.target.dataset.state.split('.');
            state[property][subProperty][field] = e.target.options[index].value;
            updateState({name: property, value: {...state[property]}});
        })
    })
}

function checkSleep(global) {
    const el = popup.querySelector("#count-down");
    if (global.sleep) {
        const time = new Date(global.sleep);
        popup.querySelector("#count-down-wrapper").classList.remove('uk-hidden');
        UIkit.countdown(el, {date: time});
    }
    if (!global.sleep && !popup.querySelector("#count-down-wrapper").classList.contains('uk-hidden')) {
        closeSleepTime(true)
        UIkit.countdown(el).stop();
    }
}

const reCalcPopup = (state) => {
    checkSleep(state.global);
    setSelectOptions(state.folders);
    addSkillsControls(state.skills);
    elements.forEach(item => {
        const [property, subProperty] = item.dataset.state.split('.');
        if (item.type === "radio") {
            item.checked = +state[property][subProperty] === +item[elementsType[item.type]];
        } else if (item.type === "select-one") {
            const optionToSelect = item.querySelector('option[value="' + state[property][subProperty] + '"]');
            if (optionToSelect) {
                optionToSelect.selected = true;
            } else {
                item.querySelector('option').selected = true;
            }
        } else {
            item[elementsType[item.type]] = state[property][subProperty];
        }
    })
}

const sendMessageOnClickButton = async (selector, action) => {
    return new Promise((resolve, reject) => {
        popup.querySelector(`#${selector}`).disabled = true;
        chrome.runtime.sendMessage({action: action}, function (res) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            popup.querySelector(`#${selector}`).disabled = false;
            resolve(res)
        });
    })
}

const clearState = async () => {
    const res = await sendMessageOnClickButton('clear', 'clear-state');
    res ? showSuccessMessage('Настройки сброшены') : showErrorMessage('Ошибка сброса настроек')
}

const scanFolders = async () => {
    const res = await sendMessageOnClickButton('scan-folders', 'scan-folders');
    if (res) {
        state.inventory_actions.to_folders = 0;
        updateState({name: 'inventory_actions', value: {...state.inventory_actions}});
        showSuccessMessage('Отделы сканированы')
    } else {
        showErrorMessage('Ошибка сканирования отделов')
    }
}

const scanSkills = async () => {
    const res = await sendMessageOnClickButton('scan-skills', 'scan-skills');
    res ? showSuccessMessage('Умения сканированы') : showErrorMessage('Ошибка сканирования умений')
}

const setSleepTime = () => {
    const sleepInput = popup.querySelector("#sleep-time-input");
    const minutes = +sleepInput.value;
    if (minutes < 1 || minutes > 300) {
        showErrorMessage('Недопустимое значение')
    } else {
        const time = Date.now() + minutes * 60000;
        state.global.sleep = new Date(time).toISOString();
        updateState({name: 'global', value: {...state.global}}, 'sleep');
        sleepInput.value = '';
        showSuccessMessage('Время задано')
    }
}

const closeSleepTime = (sleep) => {
    popup.querySelector("#count-down-wrapper").classList.add('uk-hidden');
    state.global.sleep = '';
    if (sleep) {
        state.global.run = false;
    }
    updateState({name: 'global', value: {...state.global}}, 'cancel-sleep');
}

const addListeners = () => {
    elements.forEach(el => {
        if (el.type === 'select-one') {
            el.addEventListener('change', (e) => {
                const uiSelect = UIkit.formCustom(e.target);
                const index = uiSelect.$el.options.selectedIndex;
                const [property, subProperty] = e.target.dataset.state.split('.');
                state[property][subProperty] = e.target.options[index].value;
                updateState({name: property, value: {...state[property]}});
            })
        } else {
            el.addEventListener('change', function (e) {
                const [property, subProperty] = e.target.dataset.state.split('.');
                state[property][subProperty] = e.target[elementsType[e.target.type]];
                updateState({name: property, value: {...state[property]}});
            });
        }
    });
    popup.querySelector("#clear").addEventListener("click", clearState);
    popup.querySelector("#scan-folders").addEventListener("click", scanFolders);
    popup.querySelector("#scan-skills").addEventListener("click", scanSkills);
    popup.querySelector("#sleep-time-btn").addEventListener("click", setSleepTime);
    popup.querySelector("#sleep-time-close").addEventListener("click", closeSleepTime);
}

function getState() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({action: 'get-state'}, function (res) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(res);
        });
    });
}

getState()
    .then(response => {
        Object.assign(state, response);
        reCalcPopup(state);
        addListeners();
    })
    .catch(e => {
        showErrorMessage(e.message);
    })

chrome.storage.local.onChanged.addListener(function (changes) {
    for (const prop in changes) {
        state[prop] = {...changes[prop].newValue};
    }
    reCalcPopup(state);
});

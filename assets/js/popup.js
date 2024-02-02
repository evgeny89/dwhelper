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
    'number': 'value',
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
    wrapper.classList.add('uk-column-1-2', 'uk-margin');

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
            updateState({[property]: state[property]});
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
            updateState({[property]: state[property]});
        })
    })
}

const addCaptchaControls = (captcha) => {
    const wrapper = document.querySelector('#captcha');

    for (const item in captcha) {
        if (!captcha[item].token) {
            wrapper.querySelector(`input[value="${captcha[item].value}"]`)
                .parentElement.classList.add('uk-hidden');
        }
    }
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
    addCaptchaControls(state.captcha);
    elements.forEach(item => {
        const [property, subProperty, field = null] = item.dataset.state.split('.');
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
            if (field) {
                item[elementsType[item.type]] = state[property][subProperty][field];
            } else {
                item[elementsType[item.type]] = state[property][subProperty];
            }
        }
    })
    popup.querySelector("#version").textContent = `v. ${chrome.runtime.getManifest().version}`;
}

const sendMessageOnClickButton = async (element) => {
    element.disabled = true;
    const response = await chrome.runtime.sendMessage({action: element.dataset.action});
    if (chrome.runtime.lastError) {
        showErrorMessage(chrome.runtime.lastError);
    }
    element.disabled = false;
    response ? showSuccessMessage('Действие успешно выполнено') : showErrorMessage('Ошибка выполнения команды');

    if (element.dataset.action === 'scan-folders') {
        state.inventory_actions.to_folders = 0;
        updateState({inventory_actions: state.inventory_actions});
    }
}

const setSleepTime = () => {
    const sleepInput = popup.querySelector("#sleep-time-input");
    const minutes = +sleepInput.value;
    if (minutes < 1 || minutes > 300) {
        showErrorMessage('Недопустимое значение')
    } else {
        const time = Date.now() + minutes * 60000;
        state.global.sleep = new Date(time).toISOString();
        updateState({global: state.global}, 'sleep');
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
    updateState({global: state.global}, 'cancel-sleep');
}

const addListeners = () => {
    elements.forEach(el => {
        if (el.type === 'select-one') {
            el.addEventListener('change', (e) => {
                const uiSelect = UIkit.formCustom(e.target);
                const index = uiSelect.$el.options.selectedIndex;
                const [property, subProperty] = e.target.dataset.state.split('.');
                state[property][subProperty] = e.target.options[index].value;
                updateState({[property]: state[property]});
            })
        } else {
            el.addEventListener('change', function (e) {
                const [property, subProperty, field = null] = e.target.dataset.state.split('.');
                if (field) {
                    state[property][subProperty][field] = e.target[elementsType[e.target.type]];
                } else {
                    state[property][subProperty] = e.target[elementsType[e.target.type]];
                }
                updateState({[property]: state[property]});
            });
        }
    });

    popup.querySelector("#sleep-time-btn").addEventListener("click", setSleepTime);
    popup.querySelector("#sleep-time-close").addEventListener("click", closeSleepTime);

    document.querySelectorAll('button[data-action]')
        .forEach((el) => {
            el.addEventListener('click', async (e) => {
                await sendMessageOnClickButton(e.target)
            })
        });
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

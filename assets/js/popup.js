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

const setSelectOptions = (folders) => {
    const select = popup.querySelector('select[data-state="inventory_actions.to_folders"]');

    for (const item in folders) {
        const el = document.createElement('option');
        el.value = folders[item].id;
        el.textContent = folders[item].name;
        select.insertAdjacentElement('beforeend', el);
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

const clearState = () => {
    popup.querySelector("#clear").disabled = true;
    chrome.runtime.sendMessage({action: 'clear-state'}, function (res) {
        if (res) {
            UIkit.notification({
                message: `${icons.ok} Настройки сброшены`,
                pos: 'top-right',
                status: 'success',
                timeout: noteTime.success,
            })
        } else {
            UIkit.notification({
                message: `${icons.err} Ошибка сброса настроек`,
                pos: 'top-right',
                status: 'warning',
                timeout: noteTime.error,
            })
        }
        popup.querySelector("#clear").disabled = false;
    });
}

const scanFolders = () => {
    popup.querySelector("#scan-folders").disabled = true;
    chrome.runtime.sendMessage({action: 'scans-folders'}, function (response) {
        if (response) {
            state.inventory_actions.to_folders = 0;
            updateState({name: 'inventory_actions', value: {...state.inventory_actions}});
            UIkit.notification({
                message: `${icons.ok} Отделы сканированы`,
                pos: 'top-right',
                status: 'success',
                timeout: noteTime.success,
            })
        } else {
            UIkit.notification({
                message: `${icons.err} Ошибка сканирования`,
                pos: 'top-right',
                status: 'warning',
                timeout: noteTime.error,
            })
        }
        popup.querySelector("#scan-folders").disabled = false;
    });
}

const setSleepTime = () => {
    const sleepInput = popup.querySelector("#sleep-time-input");
    const minutes = +sleepInput.value;
    if (minutes < 1 || minutes > 300) {
        UIkit.notification({
            message: `${icons.err} Недопустимое значение`,
            pos: 'top-right',
            status: 'warning',
            timeout: noteTime.error,
        })
    } else {
        const time = Date.now() + minutes * 60000;
        state.global.sleep = new Date(time).toISOString();
        updateState({name: 'global', value: {...state.global}}, 'sleep');
        sleepInput.value = '';

        UIkit.notification({
            message: `${icons.ok} Время задано`,
            pos: 'top-right',
            status: 'warning',
            timeout: noteTime.success,
        })
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
        const el = popup.querySelector('.error-modal');
        const textElement = el.querySelector('.modal-text');
        textElement.textContent = e.message;
        UIkit.modal(el).show();
    })

chrome.storage.local.onChanged.addListener(function (changes) {
    for (const prop in changes) {
        state[prop] = {...changes[prop].newValue};
    }
    reCalcPopup(state);
});

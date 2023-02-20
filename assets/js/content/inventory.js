const params = {
    stones: 'stones',
    sets: 'set_new',
    mods: 'mod_new',
    class: 'drop',
}

const links = document.querySelectorAll(".block a[href*=fif]");

links.forEach(item => {
    for (const filter in state.inventory_filters) {
        const url = new URL(item.href);
        if (Boolean(+state.inventory_filters[filter])) {
            url.searchParams.set(params[filter], String(+state.inventory_filters[filter]))
        } else {
            url.searchParams.delete(params[filter])
        }
        item.href = url.href;
    }
});

function runFilter() {
    const url = new URL(document.location.href);
    let reload = false;
    for (const filter in state.inventory_filters) {
        const stateParam = +state.inventory_filters[filter];
        const urlParam = +url.searchParams.get(params[filter]);
        if (stateParam !== urlParam) {
            if (Boolean(+state.inventory_filters[filter])) {
                url.searchParams.set(params[filter], String(+state.inventory_filters[filter]))
            } else {
                url.searchParams.delete(params[filter])
            }
            reload = true;
        }
    }

    if (reload) {
        document.location.href = url.href;
    } else {
        actionItems();
    }
}

function actionItems() {
    switch (state.inventory_actions.moved) {
        case '0':
            break;
        case '1':
            inSelectedFolder();
            break;
        case '2':
            actionApply(words.inChestText);
            break;
        case '3':
            actionApply(words.outChestText);
            break;
        case '4':
            actionApply(words.saleItemText);
            break;
    }
}

function actionApply(text) {
    const actionLink = searchLink(text);
    const ok = checkText(words.saleSuccessText);
    if (actionLink) {
        if (text === words.saleItemText) {
            const url = new URL(actionLink.href);
            url.searchParams.set('yes', '1');
            actionLink.href = url.href;
        }
        actionLink.click();
    } else if (ok) {
        const toInventory = searchLink(words.inventoryLinkText);
        if (toInventory) {
            toInventory.click();
        }
    } else {
        state.inventory_actions.moved = 0;
        updateState({name: 'inventory_actions', value: state.inventory_actions})
    }
}

function inSelectedFolder() {
    const toFolderLink = searchLink(words.toFolderLinkText);
    const checkForm = checkText(words.toFolderText);
    if (!+state.inventory_actions.to_folders) {
        return;
    }

    if (toFolderLink) {
        toFolderLink.click();
    } else if (checkForm) {
        const select = document.querySelector('[name="tofolder"]');
        const currentOption = select.querySelector('option[value="' + state.inventory_actions.to_folders + '"]');
        currentOption.selected = true;
        document.querySelector('form').submit();
    } else {
        state.inventory_actions.moved = 0;
        updateState({name: 'inventory_actions', value: state.inventory_actions})
    }
}

runFilter();

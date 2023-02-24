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
            saleItems();
            break;
    }
}

const endAction = () => {
    state.inventory_actions.moved = 0;
    updateState({name: 'inventory_actions', value: state.inventory_actions})
}

const fetchSale = async (link) => {
    const url = new URL(link.href);
    url.searchParams.set('yes', '1');

    const response = await fetch(url);
    return response.text();

}

const saleItems = async () => {
    const links = allLinks(words.saleItemText);
    if (links.length) {
        showLoader();
        for (const link of links) {
            await fetchSale(link);
        }
        hideLoader();
        refresh();
    } else {
        endAction();
    }
}

function actionApply(text) {
    const actionLink = searchLink(text);
    if (actionLink) {
        actionLink.click();
    } else {
        endAction();
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

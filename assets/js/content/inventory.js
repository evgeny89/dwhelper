waitToReadyState().then(() => {
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
                actionApply(words.toFolderLinkText);
                break;
            case '2':
                actionApply(words.inChestText);
                break;
            case '3':
                actionApply(words.outChestText);
                break;
            case '4':
                actionApply(words.fromFolderTextLink);
                break;
            case '5':
                actionApply(words.saleItemText);
                break;
        }
    }

    const getFormAction = (itemId) => {
        const formAction = new URL(`${url.origin}${pathNames.inventory}`);
        formAction.searchParams.set('chest', '1');
        formAction.searchParams.set('item', itemId);
        formAction.searchParams.set('UIN', url.searchParams.get('UIN'));
        formAction.searchParams.set('pass', url.searchParams.get('pass'));

        return formAction;
    }

    const getBody = () => {
        const params = new URLSearchParams();
        params.set('tofolder', state.inventory_actions.to_folders)
        params.set('pass', atob(url.searchParams.get('pass')))
        params.set('UIN', url.searchParams.get('UIN'))

        return params;
    }

    const endAction = () => {
        state.inventory_actions.moved = 0;
        updateState({inventory_actions: state.inventory_actions})
    }

    const fetchSale = async (link) => {
        const url = new URL(link.href);
        url.searchParams.set('yes', '1');

        const response = await fetch(url, {redirect: 'manual'});
        return response.text();

    }

    const toFolders = async (link) => {
        const itemUrl = new URL(link.href);
        const action = getFormAction(itemUrl.searchParams.get('item'))

        const response = await fetch(action.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'manual',
            body: getBody().toString()
        })
        await response.text();
    }

    async function actionApply(text) {
        if (text === words.toFolderLinkText && !+state.inventory_actions.to_folders) {
            endAction();
            return;
        }

        const links = allLinks(text);
        if (links.length) {
            showLoader();
            for (const link of links) {
                switch (text) {
                    case words.saleItemText:
                        await fetchSale(link);
                        break;

                    case words.toFolderLinkText:
                        await toFolders(link);
                        break;

                    default:
                        const response = await fetch(link.href, {redirect: 'manual'});
                        await response.text();
                }
            }
            hideLoader();
            refresh();
        } else {
            endAction();
        }
    }

    runFilter();
})

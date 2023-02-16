if (state.no_refresh.link !== null) {
    const link = state.no_refresh.link;
    state.no_refresh.link = null;
    updateState({name: 'no_refresh', value: {...state.no_refresh}});
    document.location.href = link;
}

if (url.searchParams.get('read') && state.parcels.receive) {
    const link = searchLink(words.receiveLinkText);
    if (link) {
        link.click();
    }
}

if (url.searchParams.get('write') && state.parcels.fill) {

    const form = document.querySelector("form");

    form.querySelector("input[name='theme']").value = state.parcels.theme;
    form.querySelector("textarea[name='message']").value = state.parcels.text;

    form.querySelectorAll('select:not([name="dop_item"])').forEach((el, index) => {
        const option = el.querySelectorAll('option')[index + 1];
        if (option) {
            option.selected = true;
        }
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        setLink();
        e.target.submit();
    });

    const selector = 'select:not([name="dop_item"]) > option:not([value=""])';

    if (state.parcels.send && form.querySelector(selector)) {
        setLink();
        form.submit();
    }
}

function setLink() {
    state.no_refresh.link = url.href;
    updateState({name: 'no_refresh', value: {...state.no_refresh}});
}

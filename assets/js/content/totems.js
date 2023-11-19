waitToReadyState();

const formEl = document.querySelector("form");

const saleTotems = async (values) => {
    showLoader();
    for (const value of values) {
        await fetch(formEl.action, {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `item=${value}`
        })
    }
    hideLoader();
    refresh();
}

if (formEl) {
    const selectEl = formEl.querySelector("select[name=item]");
    const values = [...selectEl.options].slice(0, 50).map(item => item.value);

    if (values.length) {
        saleTotems(values)
            .catch(e => {
                console.error(e);
                hideLoader();
            });
    }
}

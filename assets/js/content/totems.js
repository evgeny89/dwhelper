const formEl = document.querySelector("form");
const selectEl = formEl.querySelector("select[name=item]");
const values = [...selectEl.options].slice(0, 50).map(item => item.value);

const saleTotems = async () => {
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

if (values.length) {
    saleTotems()
        .catch(e => {
            console.error(e);
            hideLoader();
        });
}

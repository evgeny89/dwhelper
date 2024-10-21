waitToReadyState().then(() => {
    const formEl = document.querySelector("form");

    const saleTotems = async (values) => {
        const total = values.length;
        let counter = 0;

        showLoader();
        for (const value of values) {
            const progress = counter / total * 100
            showProgressbar(progress)
            state.temp.od += value.od;
            counter++;

            await fetch(formEl.action, {
                method: 'POST',
                redirect: 'manual',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `item=${value.id}`
            })
        }
        updateState({temp: state.temp});
        hideProgressbar();
        refresh();
    }

    if (formEl) {
        const selectEl = formEl.querySelector("select[name=item]");
        const values = [...selectEl.options].slice(0, 50).map(item => {
            return {
                id: item.value,
                od: +item.text.match(/.+\[(\d+).+]/)?.[1] ?? 0,
            }
        });

        if (values.length) {
            saleTotems(values)
                .catch(e => {
                    console.error(e);
                    hideProgressbar();
                });
        }
    } else {
        if (state.temp.od) {
            notify(`При обмене получено ${state.temp.od} очков доблести`);
            state.temp.od = 0;
            updateState({temp: state.temp});
        }
    }
});

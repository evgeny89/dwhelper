const waitResources = () => {
    const is_refresh = state.extract.is_refresh;
    state.extract.is_entered_code = false;
    let timer = delay.long;
    if (is_refresh) {
        timer = delay.waitMinutes
        state.extract.is_refresh = false;
    } else {
        state.extract.is_refresh = true;
    }
    updateState({name: 'extract', value: state.extract});

    const link = searchLink(words.refreshLinkText);
    if (link) {
        setTimeout(() => link.click(), timer);
    }
}

const fixEmptyImage = () => {
    state.extract.is_entered_code = false;
    updateState({name: 'extract', value: state.extract});
    setTimeout(() => {
        window.location.href = window.location.href;
    }, delay.long)
}

const usually = (noCaptcha = false) => {
    if (checkText(words.errorText)) {
        const link = searchLink(words.inWorld);

        if (link) {
            link.click();
        } else {
            wait();
        }
    }

    if(document.querySelector("form")) {
        if (state.extract.is_entered_code) {
            fixEmptyImage();
        } else {
            if (noCaptcha) {
                document.querySelector("form").submit();
            } else {
                state.extract.is_entered_code = true;
                updateState({name: 'extract', value: state.extract});
            }
        }
    } else {
        waitResources();
    }
}

const useService = async () => {
    if (document.querySelector("form")) {
        if (state.extract.is_entered_code) {
            fixEmptyImage();
        } else {
            const service = getServiceCaptcha();
            if (service) {
                state.extract.is_entered_code = true;
                updateState({name: 'extract', value: state.extract});
                const img = document.querySelector('img[src*="../caramba.php"]')
                service.getImage(img);
                await service.createTask();
                if (service.id) {
                    service.waitResult();
                } else {
                    wait(5)
                }
            } else {
                wait(1)
            }
        }
    } else {
        waitResources();
    }
}

switch (state.extract.type) {
    case "1":
        usually(true);
        break;
    case "2":
        useService();
        break;
    default:
        usually();
}

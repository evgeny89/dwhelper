waitToReadyState().then(() => {
    const waitResources = () => {
        const is_refresh = state.extract.is_refresh;
        state.extract.is_entered_code = false;
        let timer = delay.long;
        if (is_refresh) {
            timer = delay.minute
            state.extract.is_refresh = false;
        } else {
            state.extract.is_refresh = true;
        }
        updateState({extract: state.extract});

        const link = searchLink(words.refreshLinkText);
        if (link) {
            setTimeout(() => link.click(), timer);
        }
    }

    const fixEmptyImage = () => {
        state.extract.is_entered_code = false;
        updateState({extract: state.extract});
        setTimeout(() => {
            window.location.href = document.location.href;
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
            if (state.extract.is_entered_code && !noCaptcha) {
                fixEmptyImage();
            } else {
                if (noCaptcha) {
                    const form = document.querySelector("form");
                    if (form) {
                        submitForm(form);
                    } else {
                        wait()
                    }
                } else {
                    notify(messages.captcha);
                    state.extract.is_entered_code = true;
                    updateState({extract: state.extract});
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
                const instance = await getServiceCaptchaInstance();
                if (instance) {
                    const img = document.querySelector('img[src*="../caramba.php"]')
                    const is_valid = await instance.isBase64UrlImage(img.src)
                    if (is_valid) {
                        instance.getImage(img);
                        const localAnswer = instance.checkLocalAnswer();

                        if (localAnswer) {
                            state.extract.is_entered_code = true;
                            updateState({extract: state.extract});
                            instance.submitCode(localAnswer);
                        } else {
                            await instance.createTask(usually);
                        }
                    } else {
                        usually();
                    }
                } else {
                    usually();
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
});

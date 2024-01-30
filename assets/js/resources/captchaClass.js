class CaptchaBase {
    delimiter = null;

    constructor(lvl) {
        this.loop = 1;
        this.maxLoop = 5;
        this.warn = false;
        this.validator = new RegExp(/^\d{5,6}$/);
        this.localQuestions = {
            lvl: {
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAeCAYAAAAB4BHRAAAAAXNSR0IArs4c6QAABSdJREFUaEPtmrtzTVEUxr/8Ax6VitFRkIxK4VWhEFUmqkiDyqPxKLwKQhE0SCWZQVSMxqNAZYYZRoWGiqFS4S+I+Vmz5qzZOfueRE7uuDlnz2Tuueees9da+1uPvb6dvpmZmRm1o1Er0NeC3ii8/xrbgt48zFvQG4h5CejPn0u7dxdrsXy5dP++tGuXtHWr9Pp18duePdKTJ/b96FHp5k27PnJEunHDrtP5uLdlSzHPp0/SihXSzp3Sx4/S1JR04MBsLNh6/PghDQ3Zu+h19ap08GAet8+fpfXrpdWrpW/fCl34/v27hP4fPhTXyF61SnrwQLp40fThmXPnpM2b/83+NWtMP+SfOSNdviw9eya9fGnXp09Lly511ffK0zvK7dhhQL99Kz16VCgG8K9emZKDgwb65KQZAQiMu3ellSsLQOJ8fX0SAHKPgcH790s/f0oDAyb3wgWT4bL8k+f6+6WTJyUAHRuTzp6V1q3LLxq6Mdw5fC7kP35sAON0zLVsmXTsmDmdO7M7mts8X/ujnegR34/XXYQ9Dzpe6CN6I6D5INpY/OvXzWvjiFmgE+gsOOPXL/scHZWOH7dFT0FPMw3Pj4+bE3QaPk90gBQMB+T8eXPgGH0RnPna79Ht+pHl3IHiXCMj0vR0V6CvjvRO3kmUfP0qrV1r2YBIJz3G4ZHy8KH9FiP9/XvLCBibA8EXiDkpIaTLKpDTpXOwb98uFryOSJ+L/XONdOyiBHRhzAa9rAa7F6aRRqRTn6h3GDcxIf3+bTWUiMGQuD9wg7ymbtwovXhhUU7tZbx5Y7X00KHCfGRQanCgEyeke/fsN96/dcvkVw10QSdP8+iL03lNJwLdMQGTbEPd5/61a+U1vcr+bdsKu9i7UDbYj5A5GTE7xsxYZcsCf1/clg0HSlNlmjkWaEDl6zgqYLIBjFmjLLNUTrY0Hlhc0P+HNWKzCdjegaCT7+q5jjX2f9C3CzosfdC7sIi9JqIFvdcQq0HfFvQaFrHXpmhB7zXEatC3Bb2GRey1Kar79Mi9Y53341CW9K/Dw9aPM/j0PtQ5Zt7nGXpe+nN6YPpqKFXvt33VfCed475zqwv5Evv6uCuHRk7lwwLCC+S4d95hPvgCuAAG/bzzBNC32I8NMHcuH84AHgACKnYFdBBPnxY9P1zGvn22lqdO2fx0F9yDoqa7QGfkw5GUkV4L8LRqRi7l3um9IUpQDLKBdsh7Xnhz78uduoQrR2nn8TnIcF479vFcw7nTU3fivnPGOtPnjulnBzn5OUYOEHnHSR/s5DDID0x8XuRcuVKcMeTk85yvGc7x5UtB8eI0OCDBglM5DYtMBmcKPMMf61fTmB/3np5ybdhQDXrkl11pWDeiPYKOc+EQHHh04r7nC3pOPrQxo4xjzx2EpPej/qkcZxFjpiHrHT5cyIwZyp9HJ+7DPJIR0kxbA/DVkY6QeDKFZ8J9YwxUZVWk8y70Z5mnljF2OFadkZ6TP9dIj4scD47mGunIdxqXzADljKN5AG3aJG3fLt25Y8fKnE8Q+e/emWTAX/RI78S9AzRcOh7ImTnn5/DIpCVqdjrwXjwV5/BzeOooxkUOPWXFctx3zst9f0D949r5fuqjO2cqn5PBHPeeRufevcWxsesdo7aTfI9mnmce9jHoyb6AEkIdZ7BWXFPbWU+eYw9EqWE/UOO/MjZ3995y7zUUil6aouXea8wbvQR8g3VtbnpvQW/wCjTQ9DbSW9AbuAINNLmN9Bb0Bq5AA03+A7XXSdS88XlBAAAAAElFTkSuQmCC",
                answer: lvl,
            },
            count: {
                image: "data:image/png;base64,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",
                answer: 3,
            }
        };
    }

    _wait(){}

    createTask(fn) {
        if (typeof fn === "function") {
            fn();
        } else {
            notify(messages.captcha);
        }
    }

    getImage(imgElement) {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        c.width = imgElement.width;
        c.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);
        const blob = c.toDataURL();
        this.base64image = this._getBase64Image(blob);
    }

    checkLocalAnswer() {
        debug(debugTypes.copy, this.base64image);

        if (this.base64image === this._getBase64Image(this.localQuestions.lvl.image)) {
            return this.localQuestions.lvl.answer
        }

        if (this.base64image === this._getBase64Image(this.localQuestions.count.image)) {
            return this.localQuestions.count.answer
        }

        return null;
    }

    submitCode(code) {
        hideLoader();
        const form = document.forms[0];
        form.elements.code.value = code;
        form.submit();
    }

    _getBase64Image(blob) {
        return this.delimiter ? blob.substring(blob.indexOf(this.delimiter) + 1) : blob
    }

    _validation(number) {
        const value = (typeof number === "string") ? number : number.toString();
        return this.validator.test(value);
    }

    _waitResult(timer = 3000) {
        if (this.loop > this.maxLoop) {
            hideLoader();
            this.loop = 1;
            return null;
        }
        setTimeout(this._wait.bind(this), this.loop * timer);
    }
}

class CaptchaCapMonster extends CaptchaBase {
    constructor(lvl) {
        super(lvl);
        this.token = state.captcha.capMonster.token;
        this.urls = api.capMonster;
        this.delimiter = ':';
    }

    _getOptions() {
        return {
            method: "POST",
            body: JSON.stringify({
                "clientKey": this.token,
                "task":
                    {
                        "type": "ImageToTextTask",
                        "body": this.base64image,
                        "numeric": 1
                    }
            })
        }
    }

    async _wait() {
        const response = await fetch(this.urls.getResultUrl, {
            method: "POST",
            body: JSON.stringify({
                "clientKey": this.token,
                "taskId": this.id
            })
        });
        const json = await response.json();
        if (json.errorId) {
            hideLoader();
            notify(json.errorCode)
            wait(10);
        }

        if (json.status === "ready") {
            const num = json.solution.text;
            if (this._validation(num)) {
                this.submitCode(num);
            } else {
                hideLoader();
                wait(1)
            }
        }

        if (json.status === "processing") {
            this.loop += 1;
            this._waitResult(delay.long);
        }
    }

    async createTask() {
        try {
            showLoader();
            const response = await fetch(this.urls.createTaskUrl, this._getOptions());
            const json = await response.json();
            debug( debugTypes.show, 'Отладка. Таск создан, проверьте запрос, затем нажмите "ok"');
            if (json.taskId) {
                this.id = json.taskId;
                this._waitResult(delay.long);
            } else {
                wait(5);
            }
        } catch (e) {
            hideLoader();
            notify(e.message)
            wait(10);
        }
    }
}

class CaptchaRuCaptcha extends CaptchaBase {

    constructor(lvl) {
        super(lvl);
        this.token = state.captcha.ruCaptcha.token;
        this.urls = api.ruCaptcha;
        this.delimiter = ',';
    }

    _getOptions() {
        return {
            method: "POST",
            body: JSON.stringify({
                "method": "base64",
                "key": this.token,
                "body": this.base64image,
                "numeric": 1,
                "min_len": 5,
                "max_len": 6,
                "header_acao": 1,
                "json": 1,
            })
        }
    }

    _getResultOptions() {
        return new URLSearchParams({
            "key": this.token,
            "action": "get",
            "id": this.id,
            "json": 1,
            "header_acao": 1,
        })
    }

    async _wait() {
        const response = await fetch(this.urls.getResultUrl + "?" + this._getResultOptions());
        const json = await response.json();
        if (json.request === "CAPCHA_NOT_READY") {
            this.loop += 1;
            this._waitResult(delay.fiveSeconds);
        } else if (json.status) {
            if (this._validation(json.request)) {
                this.submitCode(json.request);
            } else {
                hideLoader();
                wait(1);
            }
        } else if (!json.status) {
            hideLoader();
            if (json.request === "ERROR_ZERO_BALANCE"){
                this.warn = true;
            }
            notify(json.request, this.warn)
            wait(10)
        }
    }

    async createTask() {
        try {
            showLoader();
            const response = await fetch(this.urls.createTaskUrl, this._getOptions());
            const json = await response.json();
            debug( debugTypes.show, 'Отладка. Таск создан, проверьте запрос, затем нажмите "ok"');
            if (json.status) {
                this.id = json.request;
                this._waitResult();
            } else {
                if (json.request === "ERROR_ZERO_BALANCE") {
                    hideLoader();
                    notify(messages.notMoney, true)
                    state.global.captcha = 0;
                    updateState({global: state.global});
                } else {
                    notify(json.error_text)
                    wait(10);
                }
            }
        } catch (e) {
            hideLoader();
            notify(e.message)
            wait(10);
        }
    }
}

class CaptchaAntiCaptcha extends CaptchaBase {
    constructor(lvl) {
        super(lvl);
        this.token = state.captcha.antiCaptcha.token;
        this.urls = api.antiCaptcha;
        this.delimiter = ',';
    }

    _getOptions() {
        return {
            method: "POST",
            body: JSON.stringify({
                "clientKey": this.token,
                "task":
                    {
                        "type": "ImageToTextTask",
                        "body": this.base64image,
                        "numeric": 1,
                        "minLength": 5,
                        "maxLength": 6,
                    }
            })
        }
    }

    async _wait() {
        const response = await fetch(this.urls.getResultUrl, {
            method: "POST",
            body: JSON.stringify({
                "clientKey": this.token,
                "taskId": this.id
            })
        });
        const json = await response.json();
        if (json.errorId) {
            hideLoader();
            if (json.errorCode === "ERROR_ZERO_BALANCE") {
                this.warn = true
            }
            notify(json.errorCode, this.warn)
            wait(10);
        }

        if (json.status === "ready") {
            const num = json.solution.text;
            if (this._validation(num)) {
                this.submitCode(num);
            } else {
                hideLoader();
                wait(1)
            }
        }

        if (json.status === "processing") {
            this.loop += 1;
            this._waitResult();
        }
    }

    async createTask() {
        try {
            showLoader();
            const response = await fetch(this.urls.createTaskUrl, this._getOptions());
            const json = await response.json();
            debug( debugTypes.show, 'Отладка. Таск создан, проверьте запрос, затем нажмите "ok"');
            if (json.taskId) {
                this.id = json.taskId;
                this._waitResult(delay.fiveSeconds);
            } else {
                wait(5);
            }
        } catch (e) {
            hideLoader();
            notify(e.message)
            wait(10);
        }
    }
}

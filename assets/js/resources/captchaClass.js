class CaptchaBase {
    delimiter = null;

    constructor(localCaptcha) {
        this.loop = 1;
        this.maxLoop = 5;
        this.warn = false;
        this.validator = new RegExp(/^\d{5,6}$/);
        this.localQuestions = localCaptcha;
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
        this.token = captcha.capMonster.token;
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
        this.token = captcha.ruCaptcha.token;
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
        this.token = captcha.antiCaptcha.token;
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

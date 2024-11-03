class CaptchaBase {
    delimiter = null;

    constructor(lvl) {
        this.loop = 1;
        this.maxLoop = 5;
        this.warn = false;
        this.validator = new RegExp(/^\d{5,6}$/);
        this.localQuestions = {
            lvl: {
                images: [
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAeCAYAAAAB4BHRAAAAAXNSR0IArs4c6QAABSdJREFUaEPtmrtzTVEUxr/8Ax6VitFRkIxK4VWhEFUmqkiDyqPxKLwKQhE0SCWZQVSMxqNAZYYZRoWGiqFS4S+I+Vmz5qzZOfueRE7uuDlnz2Tuueees9da+1uPvb6dvpmZmRm1o1Er0NeC3ii8/xrbgt48zFvQG4h5CejPn0u7dxdrsXy5dP++tGuXtHWr9Pp18duePdKTJ/b96FHp5k27PnJEunHDrtP5uLdlSzHPp0/SihXSzp3Sx4/S1JR04MBsLNh6/PghDQ3Zu+h19ap08GAet8+fpfXrpdWrpW/fCl34/v27hP4fPhTXyF61SnrwQLp40fThmXPnpM2b/83+NWtMP+SfOSNdviw9eya9fGnXp09Lly511ffK0zvK7dhhQL99Kz16VCgG8K9emZKDgwb65KQZAQiMu3ellSsLQOJ8fX0SAHKPgcH790s/f0oDAyb3wgWT4bL8k+f6+6WTJyUAHRuTzp6V1q3LLxq6Mdw5fC7kP35sAON0zLVsmXTsmDmdO7M7mts8X/ujnegR34/XXYQ9Dzpe6CN6I6D5INpY/OvXzWvjiFmgE+gsOOPXL/scHZWOH7dFT0FPMw3Pj4+bE3QaPk90gBQMB+T8eXPgGH0RnPna79Ht+pHl3IHiXCMj0vR0V6CvjvRO3kmUfP0qrV1r2YBIJz3G4ZHy8KH9FiP9/XvLCBibA8EXiDkpIaTLKpDTpXOwb98uFryOSJ+L/XONdOyiBHRhzAa9rAa7F6aRRqRTn6h3GDcxIf3+bTWUiMGQuD9wg7ymbtwovXhhUU7tZbx5Y7X00KHCfGRQanCgEyeke/fsN96/dcvkVw10QSdP8+iL03lNJwLdMQGTbEPd5/61a+U1vcr+bdsKu9i7UDbYj5A5GTE7xsxYZcsCf1/clg0HSlNlmjkWaEDl6zgqYLIBjFmjLLNUTrY0Hlhc0P+HNWKzCdjegaCT7+q5jjX2f9C3CzosfdC7sIi9JqIFvdcQq0HfFvQaFrHXpmhB7zXEatC3Bb2GRey1Kar79Mi9Y53341CW9K/Dw9aPM/j0PtQ5Zt7nGXpe+nN6YPpqKFXvt33VfCed475zqwv5Evv6uCuHRk7lwwLCC+S4d95hPvgCuAAG/bzzBNC32I8NMHcuH84AHgACKnYFdBBPnxY9P1zGvn22lqdO2fx0F9yDoqa7QGfkw5GUkV4L8LRqRi7l3um9IUpQDLKBdsh7Xnhz78uduoQrR2nn8TnIcF479vFcw7nTU3fivnPGOtPnjulnBzn5OUYOEHnHSR/s5DDID0x8XuRcuVKcMeTk85yvGc7x5UtB8eI0OCDBglM5DYtMBmcKPMMf61fTmB/3np5ybdhQDXrkl11pWDeiPYKOc+EQHHh04r7nC3pOPrQxo4xjzx2EpPej/qkcZxFjpiHrHT5cyIwZyp9HJ+7DPJIR0kxbA/DVkY6QeDKFZ8J9YwxUZVWk8y70Z5mnljF2OFadkZ6TP9dIj4scD47mGunIdxqXzADljKN5AG3aJG3fLt25Y8fKnE8Q+e/emWTAX/RI78S9AzRcOh7ImTnn5/DIpCVqdjrwXjwV5/BzeOooxkUOPWXFctx3zst9f0D949r5fuqjO2cqn5PBHPeeRufevcWxsesdo7aTfI9mnmce9jHoyb6AEkIdZ7BWXFPbWU+eYw9EqWE/UOO/MjZ3995y7zUUil6aouXea8wbvQR8g3VtbnpvQW/wCjTQ9DbSW9AbuAINNLmN9Bb0Bq5AA03+A7XXSdS88XlBAAAAAElFTkSuQmCC",
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAeCAYAAAAB4BHRAAAAAXNSR0IArs4c6QAABYxJREFUaEPtmrtPVEEUxj/8A0AraVA7NVEIlYWvykeCVj4qpAFtFBuFwlfhqxBtjFZi4qvC2AgkipWvREKlFmqlYGVj9B8Q8/Pk5A7DvXvd7C5xvXcSsnf3zsx5fOecmfmGlvn5+XmVrVAeaClBLxTef4wtQS8e5iXoBcQ8BfSpKWnXrsQXbW3S2Ji0c6e0ZYv0+nXyrqdHmpiw78ePSzdu2POxY9L16/bMfLt3L/Tt5s3JPB8+SMuX2/zv30ujo9LAwGIsfv2Svn2T9u+3seg1MpLe10d/+iStXy91dEizs4kufP/6VUL/d++S51u3pPZ26eFD6eJF04c+Z85ImzZJW7cutn98vLL9q1fbe+Qzz+XL0pMn0osX9nzqlMlawpZe3k+flrZvNyCmp6XHj6VLl0wtgH/1yp737DHQAer5c+nqVfv93j1pxYoEEObbts3mW7ZMAkAcQGPevj7p+3epq8vknj8vvXxpTvZPZNJv40bp5EkJQBnLPGvXZrsMIFtaEl3QnzkZB2AENEHHXK2tFrz9/faORqAdOGBj2PO6Trzbu3eh/QQh7f79xH5sdztj/zEX4KPfErZs0IlCb0Sjgx4qSLbhfLI67M+4sAqEQcR4nOfOwOG0Hz/sE2BPnDBneoCFn2Glof+VK9LQUGWX+XiCk0YlicFwQM6dswB2e2OgqrUfOaFvqHIEEPOEc/X2WrAsQcvP9NjoMNMpg1++SGvWWDUg01euXKg2mbJvn/Tokb0LQX/71jICY7NA8KrCrIOD0qpV+SDHjnOw79xJqhTyyGZsIPAosWGm+7Ll+rse1dpfKdO96uAT7JqbWwLI03bv8ZqOGh6F8ZpOpj99ausdxt28Kf38aWsoGYMh4f7ATfI1lVL97Jll+bp19vbNG1tLDx9OHIAMlgYAoLQ/eGDvGE/5Rn5eQxd08v0C+hJ0vqaTgR6YBALVhnWf369dMxnV2k/5drs+frRlg0pF5aSFFSCsjHm21Pi+sUc2AigulXHlqNGA3OEABZhUm7BqpFWW3Mn+jw6NBf1f8BGbTcD2Ewg6sQ/xDCSTw2D4F3RusA7/P+gNdmAzTl+C3oyo1ahzCXqNDmzG4SXozYhajTqXoNfowGYcvhj0Stw7Fvp5HCKD8ysUJWdgGp9+DuUMyvmaszx9OPNyPucMzJn30KHkvO2e8500fS5cSLjvs2crn8UhX44cMaYvngsaOZYPGcPuPebeb982Aokx8ATwBXABNM7zzhNA6mA/NsDcIZ/+cAbwAJAt4amAE8TkZHLmh8s4eNB8OTxs83O64Dds4HSBzsiHI0kjvWqItnxGLubeCQqIEhSDbOC442deeHM/lztz1dlpSjuPD5jOdoXneJ7h3DlTM28WI5ZlrHP6Hph+d5AlP4uRA0TGOOmDnTt2JBcmPi9y4Nr9jiFLPv3cZwTH588JxUvQEIAkC0HlNCwyadwpQEsDPP6rU6uOe3dK0m+5NmzIBz3tMgHWjWwPQSe4CAguPCpx39WCniUf2piWxrGHVGsoL/491D+W4yxiWGmoekePJjK9QiDD+/PM7zCPVITwlrPhoIcR7caSHUQmFxwYA1WZl+mMhf5Mi9Q0xo7AqmemZ8n/20wPHR1eHMWZ7ncKcaVBvtO4VAYoZwLNE6i7224g796VfHkh82dmTDLgUxEamumVuHeAhksnArkz5/4cHpmyxJodN1/TCQ6/HWMdxbiQQ49ZsSzuOyvSfX9AGeTZ+X7WRw/OWD43g1nce5ydXKH6tbHrHWZtLJ//H0A2f57N9Gce7g3Qk30BSwjruGc6z6zt+JN+7IFYatgP1PFfGYu7ey+59zotFs0yTcm917FuNAvoBdezuOW9wMCXoBcQ/BL0EvQCeqCAJpeZXoJeQA8U0OTf3M5P1OLoewsAAAAASUVORK5CYII=",
                    "data:image/png;base64,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",
                    ],
                answer: lvl,
            },
            count: {
                images: [
                    "data:image/png;base64,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",
                    "data:image/png;base64,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",
                    "data:image/png;base64,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",
                    ],
                answer: 3,
            }
        };
    }

    _wait(){}

    async isBase64UrlImage(base64String) {
        let image = new Image()
        image.src = base64String
        return await (new Promise((resolve)=>{
            image.onload = function () {
                if (image.height === 0 || image.width === 0) {
                    resolve(false);
                    return;
                }
                resolve(true)
            }
            image.onerror = () =>{
                resolve(false)
            }
        }))
    }

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
        debug(this.base64image);

        if (this.localQuestions.lvl.images.map((image) => this._getBase64Image(image)).includes(this.base64image)) {
            return this.localQuestions.lvl.answer
        }

        if (this.localQuestions.count.images.map((image) => this._getBase64Image(image)).includes(this.base64image)) {
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
            debug('Отладка. Таск создан, проверьте запрос, затем нажмите "ok"', debugTypes.show);
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
            debug('Отладка. Таск создан, проверьте запрос, затем нажмите "ok"', debugTypes.show);
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
            debug('Отладка. Таск создан, проверьте запрос, затем нажмите "ok"', debugTypes.show);
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

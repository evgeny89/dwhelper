class ExtractClassBase {
    constructor() {
        this.loop = 1;
        this.maxLoop = 5;
        this.validator = new RegExp(/^\d{5,6}$/);
    }
    getImageToBase64(imgElement, delimiter) {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        c.width = imgElement.width;
        c.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);
        const blob = c.toDataURL();
        this.base64image = blob.substring(blob.indexOf(delimiter) + 1);
    }

    submitCode(code) {
        const form = document.forms[0];
        form.elements.code.value = code;
        form.submit();
    }

    validation(number) {
        const value = (typeof number === "string") ? number : number.toString();
        console.log(value);
        return this.validator.test(value);
    }
}

class ExtractCapMonster extends ExtractClassBase {
    constructor() {
        super();
        this.token = captcha.capmonster.token;
        this.urls = api.capmonster;
    }

    getImage(el) {
        this.getImageToBase64(el, ":")
    }

    getOptions() {
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

    async wait() {
        const response = await fetch(this.urls.getResultUrl, {
            method: "POST",
            body: JSON.stringify({
                "clientKey": this.token,
                "taskId": this.id
            })
        });
        const json = await response.json();
        if (json.errorId) {
            console.log(json.errorCode)
        }

        if (json.status === "ready") {
            const num = json.solution.text;
            if (this.validation(num)) {
                this.submitCode(num);
            } else {
                wait(1)
            }
        }

        if (json.status === "processing") {
            this.loop += 1;
            this.waitResult();
        }
    }

    async createTask() {
        const response = await fetch(this.urls.createTaskUrl, this.getOptions());
        const json = await response.json();
        this.id = json.taskId;
    }

    waitResult() {
        if (this.loop > this.maxLoop) {
            this.loop = 1;
            return null;
        }
        setTimeout(this.wait.bind(this), this.loop * 1000);
    }
}

class ExtractRuCaptcha extends ExtractClassBase {

    constructor() {
        super();
        this.token = captcha.rucaptcha.token;
        this.urls = api.rucaptcha;
    }

    getImage(el) {
        this.getImageToBase64(el, ",")
    }

    getOptions() {
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

    getResultOptions() {
        return new URLSearchParams({
            "key": this.token,
            "action": "get",
            "id": this.id,
            "json": 1,
            "header_acao": 1,
        })
    }

    async wait() {
        const response = await fetch(this.urls.getResultUrl + "?" + this.getResultOptions());
        const json = await response.json();
        if (!json.status && json.request === "CAPCHA_NOT_READY") {
            this.loop += 1;
            this.waitResult();
        }

        if (!json.status) {
            console.log(json.request)
        }

        if (json.status) {
            if (this.validation(json.request)) {
                this.submitCode(json.request);
            }
        }
    }

    async createTask() {
        const response = await fetch(this.urls.createTaskUrl, this.getOptions());
        const json = await response.json();
        if (json.status) {
            this.id = json.request;
        } else {
            console.log(json.error_text)
        }
    }

    waitResult() {
        if (this.loop > this.maxLoop) {
            this.loop = 1;
            return null;
        }
        setTimeout(this.wait.bind(this), this.loop * 5000);
    }
}

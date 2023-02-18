class ExtractClassBase {
    delimiter = null;

    constructor(lvl) {
        this.loop = 1;
        this.maxLoop = 5;
        this.validator = new RegExp(/^\d{5,6}$/);
        this.localQuestions = {
            lvl: {
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAeCAIAAACOgoaGAAAEj0lEQVRoge1YMW/TWhT+/PRm7K1dEsSUDiSBqUhBypjBqfgDjtQhTCQT0MHZKsGQbu3oCEWoU7Ig6OJsEUVyxsDiTJVgsUf4A+cN5+Cb2C5K3gtY0fMnK7o+Pue7x8fXJ76fRkTI8cfxV9YJ/E+R1z0b5HXPBqt1n0ygaXIYBiYTAHj8WBmbTfHsdsXS7abEapqKWiwQhqhUoGl482bFR9MAIAzF2TAwGKSnuVhA01AsqomKRcknGoQhAIzHMlezidlsg/yLReHv9aBpmExk0OttocxJUAy2Ta5LROR5ZNtirNVkYJpERI5DlkVBQEFA/T45TjyWaW1bGCyLTFOuMtXyr2VRv09E5PtkWeT78ZQYjqMm4kDbpnKZfJ+CgDodsm0KAsmQiIJApb1O/lG2y/7RYNtI6zONBjQNjx4py6dPsjqurxGGuLnB5SX297G/j5MTvHv3qwd7doZKBdUqANy9C8OIO9zc4OQEmoaDA1xe4v37dJ52G8MhAAwGOD4W49ERSiXs7eHiAtMp5nOZCMDe3sb5v36t3sJYYKv1q3vcHGl1d10QgQjTqVhqNbE4Dt6+xYMHsCwEgRivrgAgDDGdqttmzOf4/BkvX8ppqSTOjOtrAHj4EP2+UBEp5ySOjzEYYDhEuy2WDx+kj3W7qNdRrWI+l0vcdtbPH4BtiyUZGJViW1hZ/a5LgDosS961yKLr5HnyVuo6AVQokOPEA9kOULlMQUC+L0bPI8dRPtyUgoAsSyzlsvDfBp6OYdtkmjJRrUZBQEQ0GikLU62Tf5Sh74s/t50oMGpfW0Kiv/87uK5qjoytd0au7DLtckfeNWyp7n8Apkm6Lq8IkVqhv+2v77dCo1wnyAL5vikb5HXPBnnds0Fe92ywhj4DoNeDYaBYxHgM/JQyWPeI1IzZTKSSYlGEkVYrrtggTT9JYjBICYzxs2KT1GdmM+GvVFCpAEAYotWS/FlsYX7WgiJ+AM2mnM5mmExgGDg7kxzGY9nHLhbC32qtbM02RfwDJ1WfYQvvKejnh3P0zc7GclkFRruMyIeVmdv0kySixKJ8kvxJfYbdeGfk+1QorDAQKTUmyR/dpuOoG7cs6nSo35ctJNOygmRZKnBz/J3yKBoNGdi2rJfTUzQa0HXcv3/rA/zyRQXyujs8VKe6DsO4VT9ZB0l+/NRnAFxcyLK9c0fmLZXw9SsATKd49UqiqlW14490mHpdCNttfPsGXcezZ+rS06cA4Lpi+fgRL17g+3fo+n8RbdbQZ87P8eQJiNTcqajVVCDRStEBHB7i6upW/WQdpPLH9BkAP37E21e9rhrmfI5792TMPLy2ADx/jvEYREr4DUMMh+h0MBrh/FwSPj3FYoEgwNHRZvnHsLL6U/UZzxMpo9MR4YIFkOXDdcnzlBJimiuqy3I/SeonSXAgv8jMwGnE+FP1Gc8Ti64rsZcJdV3p0kl+Fo44iq/qOo1G6gZ5t8xXCwUyTdWsNscu71d5YUY9ZKews3VfLHBwAAC1mujJO4WdrfuOI983ZYO87tkgr3s2yOueDfK6Z4O87tngH+IBqBNj9j/oAAAAAElFTkSuQmCC",
                answer: lvl,
            },
            count: {
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAeCAIAAACOgoaGAAAFXklEQVRoge2YzWsTWxiHn7ncbWmbZCXiIh+LUqFiGhcSFw3YjnFVsG26caPQj0UXCta2ARGitcEquJB2IXShktaKGwlNC3Xh4KapMGDpIk0WUlxlYi/9A+Yu5nQmmUx6I34Er3nIInPmnfe8+Z0zk3l/kq7rNPnl/NXoAv5Qmro3hqbujaGpe2M40l3TkGUkifFxAFlGUZiZIZlEVfH7kSRmZgAUBUkSn2QSRUGWrXzGYaGAywUwM4Mk4fejqlaMkdz4Uj61LKNp9vxAKoXLhctFKgVYZ41D29nyys2SJIlCQdRjTGpcZUwKJJMkk6TTooZqKYwkikIyid8vModC4qpYDEBVxYgt4DjdV1eJRNB1SiWh0f4+6+vcusXsLE+eUCySz4tTc3PoOnNzNVfz4UOeP0dV2d6mWGRpidnZmsGPHtHfj67T38/qqkP+eJxslmyW+Xkxouvk8ywtoWnE4+Ry5HLWWbNyE5+PjQ2AfF6MxGKUShSLaJpYEmBighcvHKQAXr6kvd1KqKrWVdEo2SyaxsoK1687BDhxpPs//3D+PEAqRVcXwPAwN28CHBwQjeJ2c/Ysh4cOOTKZik2dybC+TjTK4SGRCG434TAHB1a818vODpqGpgFsbzM6iiQxOsrnzw75/X68Xrxe3G4xIkn4fEQi7O6Sz+Px4PGIH19eeXkGVUVV6emxdInFkGWyWb58AZicpLcXt9tBiv19CgXOnRPXDg2xssLGhqXy0BAbGywvc/Gic0BN3Vtb2dkBiMVIpwEWFsQOamsjnUbT2NykpcUhR18fuk4iQSYjDru7SadpaWFzE00jnaatzYofGWFqikBA7L5gkIUFdB1d5949h/x7exQKFArs7YkRXadY5MEDOjrw+SgWxeXGwpiVl9Pezuys0MVQ+epVHj/G5xMj09NsbVEoOEgRjxOPW6laW8nnefeOzk4xMjjI/Dzt7Xi9zgFVHOl+5Qpv3iBJANEoQGcnvb0sLjI1xcQEHg/BIIeHXLjAqVMVOYz9Pj5OX58YuX+fO3c4eZJgEI+HiQmmpqz4ri5KJUolsYNu3BBT+/0sLjrkTyTo7qa7m0RCjEgSHg+3b+N2k0gQCFh/P+WVlzM4SDYrdAEiES5fFplNNe/eZXraQQq/n3C4IltPj/gDM3/R168VN5ktoAqp2a/+ADSNQIBcznoS/hfN98gfgcfD2Fj9ogN//7xi/iC+/ZnR3O+N4bfS3WhnzI/RfH1/qhqtzU/ld3vOmHf094vV0BeKo/2eTIrFD4VE92FgvE6FQiiK3TCobojNDtvlEm++xuW2L+W71dFIqFWMI7YM5RuZKhfhGIx4Y+pyr0KWv62e+ih7zhjdeSjE7m5FSCpFby/hsINhQGVD7Haztoau8/Qpb986T2g0WcabfjpNPo+u8/q13UioVYwNRyvC6KHA2UUwMaS0LcmrVwDhsDAq3r9nbe0b6qmbMt0nJ4XZ1NFRETI8zLVr4GQYVDfEySSyzPi4tRjm1gMKBYJBK/OnTywvI0mcOWM5J8cXY6OWFWHg6CKYGMuTy1m9aCrFwIDzRHXWUzdV+31sTJhTJgsLPHsGToaBrSFWFD5+ZG6OsTH7zzNYXeXSJevU6dMMDYmAra2KSWsVY6OWFWHg6CIcw/y82GHV1FlP3VTtd9PcMRkZYX0dVa0wDAzDiMqG+MQJsll6emhtdZhKUZic5MIFJIlMhkSCaBSfz+FmP6YYG11dFVaELFseDji7CCbGjRgIWPbDwEDNtamznrr5hT6BovDhg2XPyrJ4dP6RNP2ZxvBb9U3/I5q6N4am7o2hqXtjaOreGJq6N4am7o3hX7Cdl2OzpE9eAAAAAElFTkSuQmCC",
                answer: 3,
            }
        }
    }

    createTask(fn) {
        fn();
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
}

class ExtractCapMonster extends ExtractClassBase {
    constructor(lvl) {
        super(lvl);
        this.token = captcha.capmonster.token;
        this.urls = api.capmonster;
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
            console.log(json.errorCode)
        }

        if (json.status === "ready") {
            const num = json.solution.text;
            if (this._validation(num)) {
                this.submitCode(num);
            } else {
                wait(1)
            }
        }

        if (json.status === "processing") {
            this.loop += 1;
            this._waitResult();
        }
    }

    async createTask() {
        const response = await fetch(this.urls.createTaskUrl, this._getOptions());
        const json = await response.json();
        if (json.taskId) {
            this.id = json.taskId;
            this._waitResult();
        } else {
            wait(5);
        }
    }

    _waitResult() {
        if (this.loop > this.maxLoop) {
            this.loop = 1;
            return null;
        }
        setTimeout(this._wait.bind(this), this.loop * 1000);
    }
}

class ExtractRuCaptcha extends ExtractClassBase {

    constructor(lvl) {
        super(lvl);
        this.token = captcha.rucaptcha.token;
        this.urls = api.rucaptcha;
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
        if (!json.status && json.request === "CAPCHA_NOT_READY") {
            this.loop += 1;
            this._waitResult();
        }

        if (!json.status) {
            console.log(json.request)
        }

        if (json.status) {
            if (this._validation(json.request)) {
                this.submitCode(json.request);
            }
        }
    }

    async createTask() {
        const response = await fetch(this.urls.createTaskUrl, this._getOptions());
        const json = await response.json();
        if (json.status) {
            this.id = json.request;
            this._waitResult();
        } else {
            console.log(json.error_text)
            wait(5);
        }
    }

    _waitResult() {
        if (this.loop > this.maxLoop) {
            this.loop = 1;
            return null;
        }
        setTimeout(this._wait.bind(this), this.loop * 5000);
    }
}

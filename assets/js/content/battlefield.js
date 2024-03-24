const maps = {
    solo: "22442224422224444442888888888884462222222222222226666668666666684442444422442222266664442222222244444222",
    short: "224422244222222226668626862224424884224888442444422442222266664442222222244444222",
    chemist: "22442224422222222422442222266664442222222244444222",
    loose: "224444448462226688666688",
}

const doStep = (direction) => {
    const link = document.querySelector(`a[accesskey="${direction}"]`);
    if (link) {
        state.battlefield.step += 1;
        updateState({battlefield: state.battlefield})
        link.click();
    }
}

const attack = () => {
    const link = searchLink(words.toAttack) || searchLink(words.inBattle);

    if (link && !checkText(words.chemist)) {
        link.click();
    } else {
        wait(1)
    }
}

waitToReadyState().then(async () => {
    if (url.pathname === pathNames.battlefield) {
        if (checkText(words.captcha)) {
            return await solve();
        }

        if(!state.battlefield.map) {
            state.battlefield.map = 'solo';
            updateState({battlefield: state.battlefield});
            wait()
        } else {
            if ((state.world.attack && !checkText("Север:")) || state.world.attackAll || searchLink(words.inBattle)) {
                attack();
            } else {
                const step = state.battlefield.step;
                const currentStep = maps[state.battlefield.map][step];

                if (currentStep) {
                    setTimeout(() => {
                        doStep(currentStep)
                    }, delay.fiveSeconds);
                } else {
                    step.battlefield = {
                        run: false,
                        map: null,
                        step: 0,
                    }
                    updateState({battlefield: state.battlefield});
                    notify(messages.battlefieldComplete)
                }
            }
        }
    } else {
        const isTrackStartBattlefield = isBattlefieldTime()
        const timeToStart = timeToBattlefield()

        if (timeToStart > 5) {
            notify(`До начала пб осталось ${timeToStart} минут`)
            wait(delay.tenMinutes)
        } else {
            if (isTrackStartBattlefield) {
                wait(delay.halfMinute)
            }
        }
    }
})

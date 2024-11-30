waitToReadyState().then(() => {
    let useSkills = true;
    const form = document.querySelector("form");
    const activeSkills = Object.values(state.skills).filter(skill => skill.value);
    const skillControls = document.querySelectorAll('input[name="skills[]"]');
    const [, currentHp, fullHp] = (function () {
        const uin = url.searchParams.get('UIN');
        const link = document.querySelector(`a[href*="user.php?id=${uin}"]`)
        if (!link) {
            return [0, 1, 1];
        }
        const healthBar = link.parentElement.nextSibling;
        const regExp = /(\d+)\((\d+)\)/
        return healthBar.textContent.match(regExp);
    })()
    const [, currentMana] = (function () {
        if (form) {
            const regExp = /Ваши MP: (\d+)/
            return document.body.textContent.match(regExp);
        }

        return [0, 0];
    })()

    const scrollTypes = {
        hp: "полного",
        mp: "маны",
    }

    const situationalSkills = ['3', '97', '150', '133', '136', '180', '125', '124', '13', '12', '11', '10', '9'];

    const getHealthPoints = () => {
        return Math.floor(currentHp * 100 / fullHp);
    }

    const checkReadySituationSkill = (id) => {
        const needHp = fullHp - currentHp;
        // 40+ only
        switch (id) {
            case '3': // перевязка
                return getHealthPoints() < 95;
            case '97': // Вытянуть жизнь I
            case '150': // Вытянуть жизнь II
                return needHp > settings.drawLifePoints;
            case '133': // Восстановить силы I
                return needHp > 2500
            case '136': // Восстановить силы II
                return needHp > 4000
            case '180': // Исцеление XII
                return needHp > 4000
            case '125': // Исцеление XI
                return needHp > 2800
            case '124': // Исцеление X
                return needHp > 2000
            case '13': // Исцеление IX
                return needHp > 1500
            case '12': // Исцеление VIII
                return needHp > 1200
            case '11': // Исцеление VII
                return needHp > 1050
            case '10': // Исцеление VI
                return needHp > 900
            case '9': // Исцеление V
                return needHp > 750
        }
    }

    const getGroupedSkills = (skill) => {
        return activeSkills.filter(el => el.group === skill.group)
    }

    const isUseSkill = (skill) => {
        if (+skill.group) {
            const controls = Object.values(skillControls).map(el => el.value);
            return getGroupedSkills(skill)
                .every((item, inx, group) => {
                    const readySkill = controls.includes(item.id)
                    const situationInGroup = group.filter(el => situationalSkills.includes(el.id));
                    if (situationInGroup.length) {
                        return situationInGroup.every(el => checkReadySituationSkill(el.id)) && readySkill
                    } else {
                        return readySkill;
                    }
                })
        } else {
            if (situationalSkills.includes(skill.id)) {
                return checkReadySituationSkill(skill.id)
            }

            return true;
        }
    }

    const checkDefeat = () => {
        const defeat = checkText(words.defeat);
        if (defeat) {
            if (+state.world.map) {
                state.world.map = 0;
                updateState({world: state.world});
            }

            if (state.battlefield.map) {
                switch (true) {
                    case state.battlefield.map = "solo" && state.battlefield.step < 66:
                        state.battlefield.map = "short";
                        break;
                    case state.battlefield.map = "solo" && state.battlefield.step >= 66:
                        state.battlefield.map = "chemist";
                        break;
                    default:
                        state.battlefield.map = "loose";
                }
                updateState({battlefield: state.battlefield});
            }
        }
    }

    const getToWorldLink = () => {
        switch (true) {
            case !!searchLink(words.gotToLand):
                return searchLink(words.gotToLand)
            case !!searchLink(words.toBattleField):
                return searchLink(words.toBattleField)
            default:
                return searchLink(words.toMainLinkText);
        }
    }

    const setValues = (type) => {
        if (!form) return;

        const select = form.elements[type]

        if (!select) return;

        const option = Array
            .from(select.options)
            .find(item => item.value === state.battles[type])

        if (!option) {
            const random = Math.random() * (select.options.length - 1);
            select.selectedIndex = Math.floor(random);
        } else {
            option.selected = true;
        }
    }

    const setScrolls = (type) => {
        if (!form) return;

        const regEx = new RegExp(type)
        const select = form.elements.tid

        if (!select) return;

        const option = Array
            .from(select.options)
            .find(item => regEx.test(item.textContent))

        if (!option) return;

        useSkills = false
        option.selected = true
    }
    const checkEnemy = () => {
        const block = document.querySelector('.block_center')
        if  (block) {
            const enemiesText = block.innerHTML.split("<b>VS</b>")[1]
            if (enemiesText) {
                const wrapper =  document.createElement('div')
                wrapper.innerHTML = enemiesText
                return wrapper.querySelectorAll('a[href*="user.php?id="]').length > 0
            }
        }
        return false
    }

    const getDelayTime = () => {
        if  (state.battles.check_enemy && checkEnemy()) {
            return delay.twoMinutes
        }
        const fast = state.battles.faster ? delay.fast : delay.third
        const changeLink = searchLink(words.changeEnemy)
        return  changeLink ? fast : delay.long;
    }

    if (state.world.scrollLife && currentHp < +state.world.scrollLife) {
        setScrolls(scrollTypes.hp);
    } else if (state.world.scrollMana && currentMana < +state.world.scrollMana) {
        setScrolls(scrollTypes.mp);
    }

    if (form) {
        const delayTime = getDelayTime()

        if (useSkills) {
            setValues('attack');
            setValues('defence');

            skillControls.forEach(control => {
                const skill = activeSkills.find(skill => skill.id === control.value)
                if (skill && isUseSkill(skill)) {
                    control.checked = true;
                }
            })
        }

        setTimeout((el) => {
            submitForm(el);
        }, delayTime, form);
    } else {
        setTimeout(() => {
            const endBattle = checkText(words.teamVictoryText);
            const toBattle = searchLink(words.inBattle);
            if (endBattle) {
                checkDefeat();
                const toWorldLink = getToWorldLink();
                toWorldLink?.click()
            } else {
                toBattle ? toBattle.click() : refresh();
            }
        }, delay.long)
    }
});

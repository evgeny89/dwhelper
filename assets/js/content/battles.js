const form = document.querySelector("form");
const activeSkills = Object.values(state.skills).filter(skill => skill.value);
const skillControls = document.querySelectorAll('input[name="skills[]"]');
const [, currentHp, fullHp] = (function () {
    const uin = url.searchParams.get('UIN');
    const link = document.querySelector(`a[href*="user.php?id=${uin}"]`)
    const healthBar = link.parentElement.nextSibling;
    const regExp = /(\d+)\((\d+)\)/
    return healthBar.textContent.match(regExp);
})()

const situationalSkills = ['3', '97', '150'];

const getHealthPoints = () => {
    return Math.floor(currentHp * 100 / fullHp);
}

const checkReadySituationSkill = (id) => {
    if (id === '3') {
        return getHealthPoints() < 95;
    }

    if (id === '97' || id === '150') {
        return settings.drawLifePoints < fullHp - currentHp;
    }
}

const getGroupedSkills = (skill) => {
    return activeSkills.filter(el => el.group === skill.group)
}

const isUseSkill = (skill) => {
    if (skill.group) {
        const controls = Object.values(skillControls).map(el => el.value);
        return getGroupedSkills(skill).every((item, inx, group) => {
            const readyAll = controls.includes(item.id)
            const situationInGroup = group.filter(el => situationalSkills.includes(el.id));
            if (situationInGroup.length) {
                return situationInGroup.every(el => checkReadySituationSkill(el.id))
            } else {
                return readyAll;
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
    if (defeat && state.world.map) {
        state.world.map = 0;
        updateState({name: 'world', value: {...state.world}});
    }
}


if (form) {
    skillControls.forEach(control => {
        const skill = activeSkills.find(skill => skill.id === control.value)
        if (skill && isUseSkill(skill)) {
            control.checked = true;
        }
    })

    setTimeout((el) => {
        el.submit();
    }, delay.fast, form);
} else {
    setTimeout(() => {
        const toWorld = searchLink(words.gotToLand);
        const toBattle = searchLink(words.inBattle);
        if (toWorld) {
            checkDefeat();
            toWorld.click()
        } else {
            toBattle ? toBattle.click() : refresh();
        }
    }, delay.long)
}

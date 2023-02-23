const form = document.querySelector("form");
const activeSkills = Object.values(state.skills).filter(skill => skill.value);
const skillControls = document.querySelectorAll('input[name="skills[]"]');

const getHealthPoints = () => {
    const uin = url.searchParams.get('UIN');
    const link = document.querySelector(`a[href*="user.php?id=${uin}"]`)
    const healthBar = link.parentElement.nextSibling;
    const regExp = /(\d+)\((\d+)\)/
    const [, current, full] = healthBar.textContent.match(regExp);

    return Math.floor(current * 100 / full);
}

const isUseSkill = (id) => {
    if (id === '3') {
        const percents = getHealthPoints();
        return percents < 95;
    }
    return true;
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
        const index = activeSkills.findIndex(skill => skill.id === control.value)
        if (index !== -1 && isUseSkill(control.value)) {
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

waitToReadyState().then(() => {
    const helpLink = searchLink(words.help);

    if (helpLink) {
        helpLink.click();
    } else {
        const battleLink = searchLink(words.inBattle);

        if (battleLink) {
            battleLink.click();
        } else {
            setTimeout(refresh, 5000)
        }
    }
});

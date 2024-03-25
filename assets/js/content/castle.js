waitToReadyState().then(() => {
    const forgeLink = searchLink(words.toForge);

    if (forgeLink) {
        forgeLink.click();
    } else {
        const complete = checkText(words.notForgeItemsText);
        const forged = checkText(words.forgedItem);
        const ok = searchLink(words.yes);
        const form = document.querySelector('form');

        if (forged) {
            wait(1);
        }

        if (complete) {
            window.location = `${url.origin}${pathNames.world}${url.search}`;
        }

        if (form) {
            form.submit()
        }

        if (ok) {
            ok.click()
        }

        wait(1);
    }
});

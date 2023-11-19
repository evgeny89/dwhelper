waitToReadyState();

const forgeLink = searchLink(words.toForge);

if (forgeLink) {
    forgeLink.click();
} else {
    const complete = checkText(words.notForgeItemsText);
    const ok = searchLink(words.yes);
    const form = document.querySelector('form');

    if (complete) {
        window.location = `${url.origin}${pathNames.world}${url.search}`;
    }

    if (form) {
        form.submit()
    } else {
        if (ok) {
            ok.click();
        } else {
            wait(1);
        }
    }
}

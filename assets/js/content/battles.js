const form = document.querySelector("form");
if (form) {
    setTimeout((el) => {
        el.submit();
    }, delay.fast, form);
} else {
    setTimeout(() => {
        const link = searchLink(words.gotToLand);
        link ? link.click() : refresh();
    }, delay.long)
}
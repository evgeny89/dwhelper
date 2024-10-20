waitToReadyState().then(() => {
    const link = searchLink(words.inBattle) || searchLink(words.help);

    link?.click() || setTimeout(refresh, 5000);
});

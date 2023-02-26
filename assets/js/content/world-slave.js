const battleLink = searchLink(words.inBattle);

if (battleLink) {
    battleLink.click();
} else {
    wait(5);
}

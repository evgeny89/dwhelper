(async () => {
    const url = new URL(document.location.href);
    const response = await fetch(`${url.origin}/user.php${url.search}`);
    if (response.ok) {
        const userPageText = await response.text();
        const userPageBody = userPageText.replace(/\n/mg, '').match(/.*<body>(.+)<\/body>.*/);
        const el = document.createElement('DIV');
        el.innerHTML = userPageBody;
        const div = el.querySelector(".mmain").nextElementSibling;
        const spans = div.querySelectorAll(".block span[class], .block .pad");
        const items = Array.from(spans).filter(item => /drop_*|art_*/.test(item.className));
        console.log(items);
        let result = 0;
        for (const item of items) {
            const response = await fetch(item.querySelector('a[href*="&i=1&"]').href);
            const text = await setTimeout(response.text, 300);
            if (/\[Включено]/.test(text)) {
                result++;
            }
        }
        if (result) {
            state.global.textBadge = result;
            state.global.colorBadge = result > 0 ? "#bd1c1c" : "#40963d";
            updateState({name: 'global', value: state.global}, 'badge');
        }
    }
})();
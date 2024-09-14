waitToReadyState().then(() => {
    if (checkText(words.craftItem)) {
        const extractTime = extractText(words.craftTime);

        if (extractTime) {
            const [, hours, minutes, seconds] = extractTime;

            let sec = 1;

            switch (true) {
                case (+hours > 0):
                    sec = 301;
                    break;
                case (+minutes > 0):
                    sec = 61;
                    break;
                case (+seconds > 0):
                    sec = +seconds + 1;
                    break;
            }

            setTimeout(refresh, sec * 1000);
        } else {
            stopCraft()
        }
    } else {
        stopCraft()
    }
});

function stopCraft() {
    state.workshop.run = false;
    updateState({workshop: state.workshop});
}

waitToReadyState().then(async () => {
    const isTrackStartBattlefield = isBattlefieldTime()
    const timeToStart = timeToBattlefield()

    if (timeToStart > 5) {
        notify(`До начала пб осталось ${timeToStart} минут`)
        wait(delay.tenMinutes)
    } else {
        if (isTrackStartBattlefield) {
            wait(delay.halfMinute)
        }
    }
})

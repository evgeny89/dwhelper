const battlefieldPeriods = ['00:30', '12:30', '20:10']

const battlefieldPeriodTimes = {
    night: ['00:10', '00:20', '00:30'],
    day: ['12:10', '12:20', '12:30'],
    evening: ['20:10'],
}

const timeToDate = (time) => {
    const current = dayjs()
    const [hours, minutes] = time.split(':')
    const date = current.minute(minutes).hour(hours)
    if (date.isBefore(current)) {
        return date.add(1, 'day')
    }
    return date
}

const isBetween = (time, start, end = null) => {
    if (!end) {
        end = start.add(2, 'minute')
    }

    return end.isAfter(time) && start.isBefore(time)
}

const currentMoscowTime = () => {
    const offsetTimezone = (new Date().getTimezoneOffset() / 60) + 3

    return dayjs().add(offsetTimezone, 'hour')
}

const getCurrentPeriod = () => {
    const time = currentMoscowTime()
    const [night, day, evening] = battlefieldPeriods.map(timeToDate)

    if (isBetween(time, night.date(time.date()), day.date(time.date()))) {
        return battlefieldPeriodTimes.day.map(timeToDate)
    }

    if (isBetween(time, day.date(time.date()), evening.date(time.date()))) {
        return battlefieldPeriodTimes.evening.map(timeToDate)
    }

    return battlefieldPeriodTimes.night.map(timeToDate)
}

const timeToBattlefield = () => {
    const time = currentMoscowTime()
    const start = getCurrentPeriod()[0]

    return start.diff(time, 'minute')
}

const isBattlefieldTime = () => {
    const time = currentMoscowTime()

    return getCurrentPeriod().some(date => isBetween(time, date))
}

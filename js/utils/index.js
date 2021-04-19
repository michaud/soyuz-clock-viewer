const getConstants = () => {

    const TWO_PI = 2 * Math.PI;
    const secondsIn99Days = 60 * 60 * 24 * 99;
    const secondsInDay = 60 * 60 * 24;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;
    const dayRadSteps = TWO_PI / 5184000;
    const hourRadSteps = TWO_PI / (60 * 60 * 24);
    const minuteRadSteps = TWO_PI / (60 * 60);
    const secondRadSteps = TWO_PI / 60;
    const missionDayDecaRadSteps = TWO_PI / 10;
    const missionDayDigitRadSteps = TWO_PI / 10;
    const missionHourRadSteps = TWO_PI / 24;
    const missionMinuteDecaRadSteps = TWO_PI / 6;
    const missionMinuteDigitRadSteps = TWO_PI / 10;

    return {
        TWO_PI,
        radSteps: {
            day: dayRadSteps,
            hour: hourRadSteps,
            minute: minuteRadSteps,
            second: secondRadSteps,
            mission_clock_day_deca: missionDayDecaRadSteps,
            mission_clock_day_digit: missionDayDigitRadSteps,
            mission_clock_hours: missionHourRadSteps,
            mission_clock_minutes_deca: missionMinuteDecaRadSteps,
            mission_clock_minutes_digit: missionMinuteDigitRadSteps
        },
        secondsIn99Days,
        secondsInDay,
        secondsInHour,
        secondsInMinute
    }
};

export const CONST = getConstants();

export const getClockHandRadFromTime = (type, time) => CONST.radSteps[type] * time * -1;

export const getMissionHandRadFromTime = (type, time) => CONST.radSteps[type] * time * -1;

export const roundAccurately = (number, decimalPlaces) => {
    return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
};

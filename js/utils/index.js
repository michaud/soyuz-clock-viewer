const getConstants = () => {

    const TWO_PI = 2 * Math.PI;
    const secondsInDay = 60 * 60 * 24;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;
    const dayRadSteps = TWO_PI / 5184000;
    const hourRadSteps = TWO_PI / (60 * 60 * 24);
    const minuteRadSteps = TWO_PI / (60 * 60);
    const secondRadSteps = TWO_PI / 60;

    return {
        TWO_PI,
        radSteps: {
            day: dayRadSteps,
            hour: hourRadSteps,
            minute: minuteRadSteps,
            second: secondRadSteps
        },
        secondsInDay,
        secondsInHour,
        secondsInMinute
    }
};

export const CONST = getConstants();

export const getRadFromTime = (type, time) => CONST.radSteps[type] * time * -1;

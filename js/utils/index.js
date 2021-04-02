export const radSteps = {
    day: (2 * Math.PI) / 5184000,
    hour: (2 * Math.PI) / (60 * 60 * 24),
    minute: (2 * Math.PI) / (60 * 60),
    second: (2 * Math.PI) / 60
};

export const getRadFromTime = (type, time) => {

    const step = radSteps[type];

    switch (type) {

        case "second": {
            return step * ((Math.round(time * 2)) / 2)  * -1;
        }

        default: {
            return step * time  * -1;
        }
    }
};

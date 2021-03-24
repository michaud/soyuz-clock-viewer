import { radSteps } from './radSteps.js';

export function getRadFromTime(type, time) {

    const step = radSteps[type];

    switch (type) {

        case "second": {
            return step * ((Math.round(time * 2)) / 2)  * -1;
        }

        default: {
            return step * time  * -1;
        }
    }
}

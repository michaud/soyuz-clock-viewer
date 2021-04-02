import { getRadFromTime } from '../utils/index.js';

export const updateChrono = ({
    devices,
    start,
    elapsed,
    state
}) => {

    let time = 0;

    if(elapsed && start) {

        const currentDate = new Date((elapsed - start) * 1000);
        const mill = currentDate.getTime();
    
        time = mill / 1000;

        devices.chronometer.hands.forEach(hand => {
    
            hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
        })
    }
};

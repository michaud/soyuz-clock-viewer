import { getRadFromTime } from '../utils.js';

export const updateTime = (devices, timeVal) => {

    let time = 0;

    if(timeVal === undefined) {

        const currentDate = new Date();

        const offs = currentDate.getTimezoneOffset();
        const mill = currentDate.getTime() + (-offs * 60000);
    
        time = mill / 1000;

    } else {

        const currentDate = new Date(timeVal * 1000);
        const mill = currentDate.getTime();
    
        time = mill / 1000;
    }

    devices.clock.hands.forEach(hand => {

        hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
    })
}

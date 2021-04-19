import { getClockHandRadFromTime } from '../utils/index.js';

export const updateTime = ({device, ctx: {
    clockTime
}}) => {

    let time = 0;

    if(clockTime === undefined) {

        const currentDate = new Date();

        const offs = currentDate.getTimezoneOffset();
        const mill = currentDate.getTime() + (-offs * 60000);
    
        time = mill / 1000;

    } else {

        const currentDate = new Date(clockTime * 1000);
        const mill = currentDate.getTime();
    
        time = mill / 1000;
    }

    device.clock.hands.forEach(hand => {

        hand.rotation.set(0, getClockHandRadFromTime(hand.time, time), 0, 'XYZ')
    })
}

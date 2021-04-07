import { getRadFromTime } from '../utils/index.js';

export const updateTime = ({device, ctx: {
    elapsed
}}) => {

    let time = 0;

    if(elapsed === undefined) {

        const currentDate = new Date();

        const offs = currentDate.getTimezoneOffset();
        const mill = currentDate.getTime() + (-offs * 60000);
    
        time = mill / 1000;

    } else {

        const currentDate = new Date(elapsed * 1000);
        const mill = currentDate.getTime();
    
        time = mill / 1000;
    }

    device.clock.hands.forEach(hand => {

        hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
    })
}

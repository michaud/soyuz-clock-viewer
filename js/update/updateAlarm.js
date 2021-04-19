import { getClockHandRadFromTime } from '../utils/index.js';

export const updateAlarm = ({device, ctx: {
    alarmTime
}}) => {

    let time = 0;

        const currentDate = new Date(alarmTime * 1000);
        const mill = currentDate.getTime();
    
        time = mill / 1000;

    device.alarm.hands.forEach(hand => {

        hand.rotation.set(0, getClockHandRadFromTime(hand.time, time), 0, 'XYZ')
    })
}

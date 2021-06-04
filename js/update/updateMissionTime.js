import { getMissionHandRadFromTime } from '../utils/index.js';

const { Duration } = luxon;

const getNthDigitFromRight = (number, n) => Math.floor((number / Math.pow(10, n - 1)) % 10);

export const updateMissionTime = ({
    device,
    ctx: {
        missionElapsed
    }
}) => {

    const time = Duration.fromObject({
        seconds: missionElapsed
    });

    const days = time.shiftTo('days').get('days');
    const hours = Math.round(time.shiftTo('hours').get('hours') % 24);
    const minutes = time.shiftTo('minutes').get('minutes') % 60;

    const timeCalcs = {
        mission_clock_day_deca: getNthDigitFromRight(days, 2),
        mission_clock_day_digit: getNthDigitFromRight(days, 1),
        mission_clock_hours: hours,
        mission_clock_minutes_deca: getNthDigitFromRight(minutes, 2),
        mission_clock_minutes_digit: getNthDigitFromRight(minutes, 1)
    }
    
    const staticVal = 0;

    device.mission_timer.hands.forEach(hand => {

        let xVal = staticVal;
        let yVal = staticVal;
        let zVal = staticVal;

        let val = getMissionHandRadFromTime(hand.name, timeCalcs[hand.name]);
        
        if(hand.time === 'hour') {

            xVal = staticVal;
            yVal = val;
            zVal = staticVal;

        } else {

            xVal = staticVal;
            yVal = hand.name === 'mission_clock_minutes_deca' || hand.name === 'mission_clock_hours_deca' ? -val : val;
            zVal = staticVal;
        }

        hand.rotation.set(xVal, yVal, zVal, 'XYZ')
    })
};

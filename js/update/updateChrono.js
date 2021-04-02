import { getRadFromTime } from '../utils/index.js';

export const updateChrono = ({
    devices,
    ctx:{
        chronoStart,
        chronoStop,
        elapsed
    },
    state
}) => {

    let time = 0;

    switch(state) {

        case 'started': {
            
            const currentDate = new Date((elapsed - chronoStart) * 1000);
            time = currentDate.getTime() / 1000;
            
            break;
        }
        
        case 'stopped': {
            
            const currentDate = new Date((chronoStop - chronoStart) * 1000);
            time = currentDate.getTime() / 1000;

            break;
        }

        case 'reset': {

            time = 0;
        }
    }

    devices.chronometer.hands.forEach(hand => {
    
        hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
    })
};

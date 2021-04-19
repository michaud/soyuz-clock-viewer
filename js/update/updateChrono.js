import { getClockHandRadFromTime } from '../utils/index.js';

export const updateChrono = ({
    device,
    ctx:{
        chronoStart,
        chronoStop,
        clockTime
    },
    state
}) => {

    if(state.power === 'powerOn' && state.connect === 'connected') {

        let time = 0;

        switch(state.chrono) {

            case 'started': {
                
                const currentDate = new Date((clockTime - chronoStart) * 1000);
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
    
        device.chronometer.hands.forEach(hand => {
        
            hand.rotation.set(0, getClockHandRadFromTime(hand.time, time), 0, 'XYZ')
        })
    }
};

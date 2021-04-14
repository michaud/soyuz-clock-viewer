import { getRadFromTime } from '../utils/index.js';

export const updateChrono = ({
    device,
    ctx:{
        chronoStart,
        chronoStop,
        elapsed
    },
    state
}) => {

    if(state.power === 'powerOn' && state.connect === 'connected') {

        let time = 0;

        switch(state.chrono) {

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
    
        device.chronometer.hands.forEach(hand => {
        
            hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
        })
    }
};

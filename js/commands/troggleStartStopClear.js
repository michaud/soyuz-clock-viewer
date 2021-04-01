export const troggleStartStopClear = (deviceService) => () => {

    let eventName = '';

    switch(deviceService.state.value?.connected?.deviceOn?.chrono) {

        case 'idle' : {
            
            eventName = 'CHRONO_START';
            break;
        }

        case 'running': {

            eventName = 'CHRONO_STOP';
            break;
        }

        case 'stop': {

            eventName = 'CHRONO_RESET';
            break;
        }

        default: {

            eventName = '';
        }
    }

    deviceService.send(eventName);
};

export const troggleStartStopClear = (deviceService) => () => {

    let eventName = '';

    switch(deviceService.state.value?.chrono ) {

        case 'reset' : {
            
            eventName = 'CHRONO_START';
            break;
        }

        case 'started': {

            eventName = 'CHRONO_STOP';
            break;
        }

        case 'stopped': {

            eventName = 'CHRONO_RESET';
            break;
        }

        default: {

            eventName = '';
        }
    }

    deviceService.send(eventName);
};

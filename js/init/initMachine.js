import { deviceMachineDesc } from '../machines/deviceMachine.js';
import { actions } from '../machines/actions.js';
import { guards } from '../machines/guards.js';
import { services } from '../machines/services.js';
import { getActivities } from '../machines/activities.js';

const options = {
    guards,
    actions,
    services
};

export const initMachine = (state, device) => {

    const debugContainer = document.getElementById('debug');

    const { createMachine, interpret } = XState; // global variable: window.XState

    const activities = getActivities(state);

    const deviceMachine = createMachine(deviceMachineDesc, { ...options, ...activities });

    const deviceService = interpret(deviceMachine).onTransition(state => {

        const newDebugText = JSON.stringify(state.context, null, '  ') + '\n' + JSON.stringify(state.value, null, '  ');
        debugContainer.textContent = newDebugText;
    
        if (state.event.type !== '#soyuzClock.TICK') {

            if(
                state.event.type === 'ADVANCE_CLOCK'
                // the switch from clock_time_adjust to mission_time_adjust has already happened
                && state.matches('time_adjust.mission_time_adjust') 
                && state.matches('clock.near_zero')
            ) {

                    const timeAdjustButton = device.device.buttons.find(btn => btn.name === 'time_adjust');
                    timeAdjustButton.action(false);
            }
            //console.log('state', state.event.type, JSON.stringify(state.value))
        }
    });

    deviceService.start();

    // deviceService.send('TOGGLE_CONNECT')
    // deviceService.send('POWER_ON')

    return deviceService;
};

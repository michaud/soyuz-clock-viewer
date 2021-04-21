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

export const initMachine = (state) => {

    const { createMachine, interpret } = XState; // global variable: window.XState

    const activities = getActivities(state);

    const deviceMachine = createMachine(deviceMachineDesc, { ...options, ...activities });

    const deviceService = interpret(deviceMachine).onTransition(state => {

        if (state.event.type !== '#soyuzClock.TICK') {

            if(
                state.event.type === 'ADVANCE_CLOCK'
                && state.value.time_adjust === 'mission_time_adjust'
                && state.value.clock === 'near_zero') {
            }
            //console.log('state', state.event.type, JSON.stringify(state.value))
        }
    });

    deviceService.start();

    // deviceService.send('TOGGLE_CONNECT')
    // deviceService.send('POWER_ON')

    return deviceService;
};

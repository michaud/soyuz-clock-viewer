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

        // if (state.event.type !== '#soyuzClock.TICK') {

        //     console.log('state', state.event.type, JSON.stringify(state.value))
        // }
    });

    deviceService.start();

    return deviceService;
};

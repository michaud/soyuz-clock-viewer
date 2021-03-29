import { deviceMachineDesc } from './deviceMachine.js';

export const initMachine = () => {

    const { Machine, actions:machineActions, interpret } = XState; // global variable: window.XState

    const deviceMachine = Machine(deviceMachineDesc);
    
    const deviceService = interpret(deviceMachine).onTransition(state =>
        state//console.log('new state', state.value)
    );
    
    deviceService.start();
    
    return deviceService;
};

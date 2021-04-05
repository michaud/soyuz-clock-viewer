import { deviceMachineDesc } from '../machines/deviceMachine.js';

export const initMachine = () => {

    const { Machine, actions:machineActions, interpret } = XState; // global variable: window.XState

    const deviceMachine = Machine(deviceMachineDesc);
    
    const deviceService = interpret(deviceMachine).onTransition(state => {

        if(state.event.type !== 'TICK') {
            
            ///console.log('state', state.event.type, JSON.stringify(state.value))
        }
    });
    
    deviceService.start();
    
    return deviceService;
};

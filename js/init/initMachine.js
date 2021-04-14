import { deviceMachineDesc } from '../machines/deviceMachine.js';

const alarmTimeReached = context => {
    return context.elapsed > context.alarmTime;
};

const options = {
    guards: {
        alarmTimeReached // optional, if the implementation doesn't change
    }
};

export const initMachine = (state) => {

    const { createMachine, interpret } = XState; // global variable: window.XState


    const activities = {

        activities: {

            soundTheAlarm: (context, event) => {

            
                // const oscillator = state.ac.createOscillator();
                // const gain = state.ac.createGain();
                // oscillator.connect(gain);
                // oscillator.frequency.value = 293.664767917407560;
                // oscillator.type = "sine";
                // gain.connect(state.ac.destination);
                // gain.gain.value = 100 * 0.0051;
                // oscillator.start(state.ac.currentTime);
                // oscillator.stop(state.ac.currentTime + 200 * 0.001);

                const soundInterval = setInterval(() => {

                    const gainNode = state.ac.createGain();
                    gainNode.connect(state.ac.destination);
                    const oscillator = state.ac.createOscillator();
                    oscillator.connect(gainNode);
                    gainNode.gain.value = 100 * 0.0021;
                    gainNode.gain.setValueAtTime(1, state.ac.currentTime);

                    oscillator.start();

                    gainNode.gain.setValueAtTime(gainNode.gain.value, state.ac.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, state.ac.currentTime + 1);

                    oscillator.stop(state.ac.currentTime + 200 * 0.001);

                }, 1000);

                return () => { clearInterval(soundInterval) }
            }
        }
    }

    const deviceMachine = createMachine(deviceMachineDesc, { ...options, ...activities });

    const deviceService = interpret(deviceMachine).onTransition(state => {

        if (state.event.type !== 'TICK') {

            console.log('state', state.event.type, JSON.stringify(state.value))
        }
    });

    deviceService.start();

    return deviceService;
};

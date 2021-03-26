import { toggleOnOffDevice } from './toggleOnOffDevice.js';
import { advanceClockSecondHand } from './advanceClockSecondHand.js';
import { connectDevice } from './connectDevice.js';

export const initCommands = (deviceService) => {

    return {
        toggle_device_on_off: toggleOnOffDevice(deviceService),
        advance_second_hand: advanceClockSecondHand,
        connect_device: connectDevice(deviceService)
    };
};

import { toggleOnOffDevice } from './toggleOnOffDevice.js';
import { advanceClockSecondHand } from './advanceClockSecondHand.js';
import { connectDevice } from './connectDevice.js';
import { troggleStartStopClear } from './troggleStartStopClear.js';
import { toggleOnOffAlarm } from './toggleOnOffAlarm.js';

export const initCommands = (deviceService) => {

    return {
        toggle_device_on_off: toggleOnOffDevice(deviceService),
        advance_second_hand: advanceClockSecondHand(deviceService),
        connect_device: connectDevice(deviceService),
        troggle_start_stop_clear: troggleStartStopClear(deviceService),
        switch_alarm_on_off: toggleOnOffAlarm(deviceService)
    };
};

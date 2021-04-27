import { timeAdjustMove } from './timeAdjustMove.js';
import { timeAdjustUp } from './timeAdjustUp.js';
import { timeAdjustOver } from './timeAdjustOver.js';
import { alarmAdjustMove } from './alarmAdjustMove.js';
import { alarmAdjustUp } from './alarmAdjustUp.js';
import { alarmAdjustOver } from './alarmAdjustOver.js';
import { missionResetMove } from './missionResetMove.js';
import { missionResetOver } from './missionResetOver.js';
import { missionResetUp } from './missionResetUp.js';
import { advanceSecondHandOver } from './advanceSecondHandOver.js';
import { chronoTroggleOver } from './chronoTroggleOver.js';
import { alarmToggleOver } from './alarmToggleOver.js';
import { powerSwitchOver } from './powerSwitchOver.js';

const moves = {
    time_adjust: timeAdjustMove,
    alarm_adjust_nob: alarmAdjustMove,
    clear_to_zero_nob: missionResetMove
};

const ups = {
    time_adjust: timeAdjustUp,
    alarm_adjust_nob: alarmAdjustUp,
    clear_to_zero_nob: missionResetUp
};

const overs = {
    time_adjust: timeAdjustOver,
    alarm_adjust_nob: alarmAdjustOver,
    clear_to_zero_nob: missionResetOver,
    start_stop_clear_button: chronoTroggleOver,
    switch_device_on_off: powerSwitchOver,
    switch_alarm_on_off: alarmToggleOver,
    advance_second_hand_object: advanceSecondHandOver
};

export default {
    moves,
    ups,
    overs
};

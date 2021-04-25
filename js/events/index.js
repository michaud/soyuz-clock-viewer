import { timeAdjustMove } from './timeAdjustMove.js';
import { timeAdjustUp } from './timeAdjustUp.js';
import { timeAdjustOver } from './timeAdjustOver.js';
import { alarmAdjustMove } from './alarmAdjustMove.js';
import { alarmAdjustUp } from './alarmAdjustUp.js';
import { alarmAdjustOver } from './alarmAdjustOver.js';
import { missionResetMove } from './missionResetMove.js';
import { missionResetOver } from './missionResetOver.js';
import { missionResetUp } from './missionResetUp.js';


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
    clear_to_zero_nob: missionResetOver
};

export default {
    moves,
    ups,
    overs
};

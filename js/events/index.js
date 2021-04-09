import { timeAdjustMove } from './timeAdjustMove.js';
import { timeAdjustUp } from './timeAdjustUp.js';
import { timeAdjustOver } from './timeAdjustOver.js';
import { alarmAdjustMove } from './alarmAdjustMove.js';
import { alarmAdjustUp } from './alarmAdjustUp.js';
import { alarmAdjustOver } from './alarmAdjustOver.js';

const moves = {
    time_adjust: timeAdjustMove,
    alarm_adjust_nob: alarmAdjustMove
};

const ups = {
    time_adjust: timeAdjustUp,
    alarm_adjust_nob: alarmAdjustUp
};

const overs = {
    time_adjust: timeAdjustOver,
    alarm_adjust_nob: alarmAdjustOver
};

export default {
    moves,
    ups,
    overs
};

import { timeAdjustMove } from './timeAdjustMove.js';
import { timeAdjustUp } from './timeAdjustUp.js';
import { timeAdjustOver } from './timeAdjustOver.js';

const moves = {
    time_adjust: timeAdjustMove
}

const ups = {
    time_adjust: timeAdjustUp
}

const overs = {
    time_adjust: timeAdjustOver
}

export default {
    moves,
    ups,
    overs
}

export const guards = {
    alarmTimeReached: context => context.clockTime > context.alarmTime,
    missionTimeAdjustAllowed: context => context.clockTime % 60 < 1.6 && context.clockTime % 60 > 58.4,
    clockTimeNearZero: context => context.clockTime % 60 < 1.6 && context.clockTime % 60 < 58.4,
    clockTimeAwayForZero: context => context.clockTime % 60 > 1.5 && context.clockTime % 60 < 58.5,
    isClockAdjust: (_, e, machine) => machine.state.value.time_adjust === 'clock_time_adjust'
};

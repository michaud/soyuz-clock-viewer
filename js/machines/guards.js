export const guards = {
    alarmTimeReached: context => context.clockTime > context.alarmTime,
    missionTimeAdjustAllowed: context => context.clockTime % 60 < 1.5 && context.clockTime % 60 > 58.5,
    clockTimeNearZero: context => context.clockTime % 60 < 1.5 || context.clockTime % 60 > 58.5,
    clockTimeAwayForZero: context => context.clockTime % 60 > 1 && context.clockTime % 60 < 59,
    isClockAdjust: (_, e, machine) => machine.state.value.time_adjust === 'clock_time_adjust',
    isClockAdjustAndclockTimeNearZero: (context, _, machine) => (machine.state.value.time_adjust === 'clock_time_adjust')
        && (context.clockTime % 60 < 1.5 || context.clockTime % 60 > 58.5)
};

const { assign, send } = XState;

export const actions = {
    updateClockTime: assign({
        clockTime: (_, event) => event.delta
    }),

    advanceClockTime: assign({
        clockTime: context => +(context.clockTime + context.interval).toFixed(2)
    }),

    advanceMissionTime: assign({
        missionElapsed: context => +(context.missionElapsed + context.interval).toFixed(2)
    }),

    updateMissionTime: assign({
        missionElapsed: (_, event) => event.delta
    }),

    updateAlarmTime: assign({
        alarmTime: (_, event) => event.delta
    }),

    setPowerOn: assign({
        isPowerOn: true
    }),

    setPowerOff: assign({
        isPowerOn: false
    }),

    setIsConnected: assign({
        isConnected: true
    }),

    setIsDisconnected: assign({
        isConnected: false
    }),

    resetChrono: assign({
        chronoStart: _ => 0,
        chronoStop: _ => 0
    }),

    setChronoStopTime: assign({
        chronoStop: context => context.clockTime
    }),

    setChronoStartTime: assign({
        chronoStart: context => context.clockTime
    })
};

const { assign } = XState;

export const actions = {

    updateElapsed: assign({
        elapsed: (_, event) => event.delta
    }),

    advanceElapsed: assign({
        elapsed: context => +(context.elapsed + context.interval).toFixed(2)
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
        chronoStop: context => context.elapsed
    }),

    setChronoStartTime: assign({
        chronoStart: context => context.elapsed
    })
};

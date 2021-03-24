const watchMachine = createMachine(
    {
        id: 'watch',
        initial: 'alive',
        context: {
            T: {
                sec: 50,
                oneMin: 9,
                tenMin: 5,
                hr: 11,
                mon: 11,
                date: 30,
                day: 0,
                year: INITIAL_YEAR,
                mode: '24h',
            },
            T1: {
                sec: 0,
                oneMin: 0,
                tenMin: 0,
                hr: 12,
            },
            T2: {
                sec: 0,
                oneMin: 0,
                tenMin: 0,
                hr: 12,
            },
            stopwatch: INITIAL_STOPWATCH_CONTEXT,
            TICK_INTERVAL: 1000,
            batteryPercentage: 100,
        },
        states: {
            dead: {
                id: 'dead',
                type: 'final',
            },
            alive: {
                type: 'parallel',
                invoke: [
                    {
                        src: 'ticker',
                    },
                ],
                states: {
                    'alarm-1-status': {
                        initial: 'disabled',
                        states: {
                            disabled: {
                                on: {
                                    D_PRESSED: {
                                        target: 'enabled',
                                        in: '#watch.alive.main.displays.out.alarm-1.off',
                                    },
                                },
                            },
                            enabled: {
                                on: {
                                    D_PRESSED: {
                                        target: 'disabled',
                                        in: '#watch.alive.main.displays.out.alarm-1.on',
                                    },
                                },
                            },
                        },
                    },
                    'alarm-2-status': {
                        initial: 'disabled',
                        states: {
                            disabled: {
                                on: {
                                    D_PRESSED: {
                                        target: 'enabled',
                                        in: '#watch.alive.main.displays.out.alarm-2.off',
                                    },
                                },
                            },
                            enabled: {
                                on: {
                                    D_PRESSED: {
                                        target: 'disabled',
                                        in: '#watch.alive.main.displays.out.alarm-2.on',
                                    },
                                },
                            },
                        },
                    },
                    'chime-status': {
                        initial: 'disabled',
                        states: {
                            disabled: {
                                on: {
                                    D_PRESSED: {
                                        target: 'enabled.quiet',
                                        in: '#watch.alive.main.displays.out.chime.off',
                                    },
                                },
                            },
                            enabled: {
                                states: {
                                    quiet: {
                                        on: {
                                            T_IS_WHOLE_HOUR: {
                                                target: 'beep',
                                            },
                                        },
                                    },
                                    beep: {
                                        after: {
                                            CHIME_BEEP_DURATION: {
                                                target: 'quiet',
                                            },
                                        },
                                    },
                                },
                                on: {
                                    D_PRESSED: {
                                        target: 'disabled',
                                        in: '#watch.alive.main.displays.out.chime.on',
                                    },
                                },
                            },
                        },
                    },
                    light: {
                        initial: 'off',
                        states: {
                            off: {
                                on: {
                                    B_PRESSED: {
                                        target: 'on',
                                    },
                                },
                            },
                            on: {
                                on: {
                                    B_RELEASED: {
                                        target: 'off',
                                    },
                                },
                            },
                        },
                    },
                    power: {
                        initial: 'ok',
                        states: {
                            ok: {
                                on: {
                                    BATTERY_WEAKENS: {
                                        target: 'blink',
                                    },
                                },
                            },
                            blink: {
                                on: {
                                    WEAK_BATTERY_DIES: {
                                        target: '#dead',
                                    },
                                },
                            },
                        },
                    },
                    main: {
                        initial: 'displays',
                        states: {
                            displays: {
                                initial: 'regularAndBeep',
                                states: {
                                    hist: {
                                        type: 'history',
                                        history: 'deep',
                                    },
                                    regularAndBeep: {
                                        type: 'parallel',
                                        states: {
                                            regular: {
                                                initial: 'time',
                                                states: {
                                                    time: {
                                                        id: 'time',
                                                        on: {
                                                            A_PRESSED: {
                                                                target: '#alarm-1.hist',
                                                            },
                                                            C_PRESSED: {
                                                                target: '#wait',
                                                            },
                                                            D_PRESSED: {
                                                                target: 'date',
                                                            },
                                                        },
                                                    },
                                                    date: {
                                                        after: {
                                                            IDLENESS_DELAY: {
                                                                target: 'time',
                                                            },
                                                        },
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'time',
                                                            },
                                                        },
                                                    },
                                                    update: {
                                                        initial: 'sec',
                                                        invoke: {
                                                            id: 'idlenessTimer',
                                                            src: 'idlenessTimer',
                                                        },
                                                        states: {
                                                            sec: {
                                                                id: 'sec',
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: '1min',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTByOneSec',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            '1min': {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: '10min',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTByOneMin',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            '10min': {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: 'hr',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTByTenMin',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            hr: {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: 'mon',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTByOneHour',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            mon: {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: 'date',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTMonth',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            date: {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: 'day',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTDate',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            day: {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: 'year',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTDay',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            year: {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: 'mode',
                                                                        actions: ['resetIdlenessTimer'],
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'incrementTYear',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            mode: {
                                                                on: {
                                                                    C_PRESSED: {
                                                                        target: '#time',
                                                                    },
                                                                    D_PRESSED: {
                                                                        actions: [
                                                                            'toggleClockMode',
                                                                            'resetIdlenessTimer',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        on: {
                                                            B_PRESSED: {
                                                                target: 'time',
                                                            },
                                                            IDLENESS_TIMER_EXPIRED: {
                                                                target: 'time',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                            'beep-test': {
                                                initial: '00',
                                                states: {
                                                    '00': {
                                                        on: {
                                                            B_PRESSED: {
                                                                target: '10',
                                                            },
                                                            D_PRESSED: {
                                                                target: '01',
                                                            },
                                                        },
                                                    },
                                                    10: {
                                                        on: {
                                                            B_RELEASED: {
                                                                target: '00',
                                                            },
                                                            D_PRESSED: {
                                                                target: 'beep',
                                                            },
                                                        },
                                                    },
                                                    '01': {
                                                        on: {
                                                            D_RELEASED: {
                                                                target: '00',
                                                            },
                                                            B_PRESSED: {
                                                                target: 'beep',
                                                            },
                                                        },
                                                    },
                                                    beep: {
                                                        on: {
                                                            B_RELEASED: {
                                                                target: '01',
                                                            },
                                                            D_RELEASED: {
                                                                target: '10',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    wait: {
                                        id: 'wait',
                                        after: {
                                            WAIT_DELAY: {
                                                target: '#sec',
                                            },
                                        },
                                        on: {
                                            C_RELEASED: {
                                                target: '#time',
                                            },
                                        },
                                    },
                                    out: {
                                        initial: 'alarm-1',
                                        invoke: {
                                            id: 'idlenessTimer',
                                            src: 'idlenessTimer',
                                        },
                                        states: {
                                            'alarm-1': {
                                                id: 'alarm-1',
                                                initial: 'off',
                                                states: {
                                                    hist: {
                                                        type: 'history',
                                                    },
                                                    off: {
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'on',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                        },
                                                    },
                                                    on: {
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'off',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                        },
                                                    },
                                                },
                                                on: {
                                                    A_PRESSED: {
                                                        target: 'alarm-2.hist',
                                                        actions: ['resetIdlenessTimer'],
                                                    },
                                                    C_PRESSED: {
                                                        target: 'update-1.hr',
                                                        actions: ['resetIdlenessTimer'],
                                                    },
                                                },
                                            },
                                            'update-1': {
                                                states: {
                                                    hr: {
                                                        on: {
                                                            C_PRESSED: {
                                                                target: '10min',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                            D_PRESSED: {
                                                                actions: [
                                                                    'incrementT1ByOneHour',
                                                                    'resetIdlenessTimer',
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    '10min': {
                                                        on: {
                                                            C_PRESSED: {
                                                                target: '1min',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                            D_PRESSED: {
                                                                actions: [
                                                                    'incrementT1ByTenMin',
                                                                    'resetIdlenessTimer',
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    '1min': {
                                                        on: {
                                                            C_PRESSED: {
                                                                target: '#alarm-1',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                            D_PRESSED: {
                                                                actions: [
                                                                    'incrementT1ByOneMin',
                                                                    'resetIdlenessTimer',
                                                                ],
                                                            },
                                                        },
                                                    },
                                                },
                                                on: {
                                                    B_PRESSED: {
                                                        target: 'alarm-1',
                                                        actions: ['resetIdlenessTimer'],
                                                    },
                                                },
                                            },
                                            'update-2': {
                                                states: {
                                                    hr: {
                                                        on: {
                                                            C_PRESSED: {
                                                                target: '10min',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                            D_PRESSED: {
                                                                actions: [
                                                                    'incrementT2ByOneHour',
                                                                    'resetIdlenessTimer',
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    '10min': {
                                                        on: {
                                                            C_PRESSED: {
                                                                target: '1min',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                            D_PRESSED: {
                                                                actions: [
                                                                    'incrementT2ByTenMin',
                                                                    'resetIdlenessTimer',
                                                                ],
                                                            },
                                                        },
                                                    },
                                                    '1min': {
                                                        on: {
                                                            C_PRESSED: {
                                                                target: '#alarm-2',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                            D_PRESSED: {
                                                                actions: [
                                                                    'incrementT2ByOneMin',
                                                                    'resetIdlenessTimer',
                                                                ],
                                                            },
                                                        },
                                                    },
                                                },
                                                on: {
                                                    B_PRESSED: {
                                                        target: 'alarm-2',
                                                        actions: ['resetIdlenessTimer'],
                                                    },
                                                },
                                            },
                                            'alarm-2': {
                                                id: 'alarm-2',
                                                initial: 'off',
                                                states: {
                                                    hist: {
                                                        type: 'history',
                                                    },
                                                    off: {
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'on',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                        },
                                                    },
                                                    on: {
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'off',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                        },
                                                    },
                                                },
                                                on: {
                                                    A_PRESSED: {
                                                        target: 'chime.hist',
                                                        actions: ['resetIdlenessTimer'],
                                                    },
                                                    C_PRESSED: {
                                                        target: 'update-2.hr',
                                                        actions: ['resetIdlenessTimer'],
                                                    },
                                                },
                                            },
                                            chime: {
                                                initial: 'off',
                                                states: {
                                                    hist: {
                                                        type: 'history',
                                                    },
                                                    off: {
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'on',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                        },
                                                    },
                                                    on: {
                                                        on: {
                                                            D_PRESSED: {
                                                                target: 'off',
                                                                actions: ['resetIdlenessTimer'],
                                                            },
                                                        },
                                                    },
                                                },
                                                on: {
                                                    A_PRESSED: {
                                                        target: '#stopwatch.hist',
                                                    },
                                                },
                                            },
                                        },
                                        on: {
                                            IDLENESS_TIMER_EXPIRED: {
                                                target: 'regularAndBeep',
                                            },
                                        },
                                    },
                                    stopwatch: {
                                        id: 'stopwatch',
                                        initial: 'zero',
                                        states: {
                                            hist: {
                                                type: 'history',
                                                history: 'deep',
                                            },
                                            zero: {
                                                id: 'zero',
                                                entry: ['resetStopwatch'],
                                                on: {
                                                    B_PRESSED: {
                                                        target: [
                                                            'displayAndRun.display.regular',
                                                            'displayAndRun.run.on',
                                                        ],
                                                        actions: ['startStopwatch'],
                                                    },
                                                },
                                            },
                                            displayAndRun: {
                                                type: 'parallel',
                                                states: {
                                                    display: {
                                                        states: {
                                                            regular: {
                                                                on: {
                                                                    D_PRESSED: [
                                                                        {
                                                                            target: 'lap',
                                                                            in:
                                                                                '#watch.alive.main.displays.stopwatch.displayAndRun.run.on',
                                                                            actions: ['saveStopwatchLap'],
                                                                        },
                                                                        {
                                                                            target: '#zero',
                                                                            in:
                                                                                '#watch.alive.main.displays.stopwatch.displayAndRun.run.off',
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                            lap: {
                                                                on: {
                                                                    D_PRESSED: {
                                                                        target: 'regular',
                                                                        actions: ['clearStopwatchLap'],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                    run: {
                                                        id: 'run',
                                                        states: {
                                                            on: {
                                                                invoke: {
                                                                    src: 'stopwatch',
                                                                },
                                                                on: {
                                                                    B_PRESSED: {
                                                                        target: 'off',
                                                                        actions: ['pauseStopwatch'],
                                                                    },
                                                                    STOPWATCH_TICK: {
                                                                        actions: [
                                                                            assign({
                                                                                stopwatch: ({ stopwatch }) => ({
                                                                                    ...stopwatch,
                                                                                    elapsedTotal:
                                                                                        stopwatch.elapsedBeforeStart +
                                                                                        Date.now() -
                                                                                        stopwatch.start,
                                                                                }),
                                                                            }),
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            off: {
                                                                on: {
                                                                    B_PRESSED: {
                                                                        target: 'on',
                                                                        actions: ['startStopwatch'],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        on: {
                                            A_PRESSED: {
                                                target: 'regularAndBeep',
                                            },
                                        },
                                    },
                                },
                                on: {
                                    T_HITS_T1: [
                                        {
                                            target: 'alarms-beep.both-beep',
                                            cond: 'P',
                                        },
                                        {
                                            target: 'alarms-beep.alarm-1-beeps',
                                            cond: 'P1',
                                        },
                                    ],
                                    T_HITS_T2: {
                                        target: 'alarms-beep.alarm-2-beeps',
                                        cond: 'P2',
                                    },
                                },
                            },
                            'alarms-beep': {
                                states: {
                                    'alarm-1-beeps': {},
                                    'alarm-2-beeps': {},
                                    'both-beep': {},
                                },
                                on: {
                                    A_PRESSED: 'displays.hist',
                                    B_PRESSED: 'displays.hist',
                                    C_PRESSED: 'displays.hist',
                                    D_PRESSED: 'displays.hist',
                                },
                                after: {
                                    ALARM_BEEPS_DELAY: 'displays.hist',
                                },
                            },
                        },
                    },
                },
                on: {
                    TICK: {
                        actions: [
                            pure((ctx) => {
                                const newBatteryPercentage = ctx.batteryPercentage - 0.1;
                                const isWeakBattery = newBatteryPercentage < 10;
                                const isDeadBattery = newBatteryPercentage <= 0;
                                let actions = [];

                                if (isWeakBattery) {
                                    actions.push(send('BATTERY_WEAKENS'));
                                }

                                if (isDeadBattery) {
                                    actions.push(send('WEAK_BATTERY_DIES'));
                                } else {
                                    actions.push(
                                        assign({ batteryPercentage: newBatteryPercentage })
                                    );
                                }

                                return actions;
                            }),
                            pure((ctx) => {
                                let actions = [];

                                const newTime = getTimeAfterTick(ctx.T);
                                actions.push(
                                    assign({
                                        T: newTime,
                                    })
                                );

                                if (areTimesEqual(newTime, ctx.T1)) {
                                    actions.push(send('T_HITS_T1'));
                                }

                                if (areTimesEqual(newTime, ctx.T2)) {
                                    actions.push(send('T_HITS_T2'));
                                }

                                if (isWholeHour(newTime)) {
                                    actions.push(send('T_IS_WHOLE_HOUR'));
                                }

                                return actions;
                            }),
                        ],
                    },
                },
            },
        },
    },
    {
        delays: {
            IDLENESS_DELAY,
            WAIT_DELAY: seconds(0.5),
            ALARM_BEEPS_DELAY: seconds(30),
            CHIME_BEEP_DURATION: seconds(2),
        },
        actions: {
            resetIdlenessTimer: send('RESET_IDLENESS_TIMER', { to: 'idlenessTimer' }),
            resetStopwatch: assign({
                stopwatch: INITIAL_STOPWATCH_CONTEXT,
            }),
            startStopwatch: assign({
                stopwatch: ({ stopwatch }) => ({
                    ...stopwatch,
                    start: Date.now(),
                }),
            }),
            pauseStopwatch: assign({
                stopwatch: ({ stopwatch }) => {
                    const elapsed =
                        stopwatch.elapsedBeforeStart + Date.now() - stopwatch.start;
                    return {
                        ...stopwatch,
                        elapsedBeforeStart: elapsed,
                        elapsedTotal: elapsed,
                    };
                },
            }),
            saveStopwatchLap: assign({
                stopwatch: ({ stopwatch }) => ({
                    ...stopwatch,
                    lap: stopwatch.elapsedBeforeStart + Date.now() - stopwatch.start,
                }),
            }),
            clearStopwatchLap: assign({
                stopwatch: ({ stopwatch }) => ({
                    ...stopwatch,
                    lap: 0,
                }),
            }),
            ...timeIncrementActions,
            ...dateIncrementActions,
        },
        guards: {
            P: (ctx, _, condMeta) => {
                return (
                    areTimesEqual(ctx.T1, ctx.T2) &&
                    condMeta.state.matches('alive.alarm-1-status.enabled') &&
                    condMeta.state.matches('alive.alarm-2-status.enabled')
                );
            },
            P1: (ctx, _, condMeta) => {
                return (
                    condMeta.state.matches('alive.alarm-1-status.enabled') &&
                    (condMeta.state.matches('alive.alarm-2-status.disabled') ||
                        !areTimesEqual(ctx.T1, ctx.T2))
                );
            },
            P2: (ctx, _, condMeta) => {
                return (
                    condMeta.state.matches('alive.alarm-2-status.enabled') &&
                    (condMeta.state.matches('alive.alarm-1-status.disabled') ||
                        !areTimesEqual(ctx.T1, ctx.T2))
                );
            },
        },
        services: {
            ticker: (context) => (callback) => {
                const id = setInterval(() => callback('TICK'), context.TICK_INTERVAL);

                return () => clearInterval(id);
            },
            stopwatch: () => (callback) => {
                const id = setInterval(
                    () => callback('STOPWATCH_TICK'),
                    STOPWATCH_INTERVAL
                );

                return () => clearInterval(id);
            },
            idlenessTimer: () => (callback, onReceive) => {
                const start = function start() {
                    return setInterval(
                        () => callback('IDLENESS_TIMER_EXPIRED'),
                        IDLENESS_DELAY
                    );
                };
                let id = start();

                onReceive((e) => {
                    if (e.type === 'RESET_IDLENESS_TIMER') {
                        clearInterval(id);
                        id = start();
                    }
                });

                return () => clearInterval(id);
            },
        },
    }
);

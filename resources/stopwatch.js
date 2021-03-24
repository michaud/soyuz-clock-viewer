const stopwatch = {
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
}

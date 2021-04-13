
// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const alarmTimeReached = context => {
    return context.elapsed > context.alarmTime;
};

const options = {
    guards: {
        alarmTimeReached // optional, if the implementation doesn't change
    }
};

const soyuzClockMachine = Machine({
    id: 'soyuzClock',
    type: 'parallel',
    context: {
        elapsed: 0,
        duration: 5,
        interval: .5,
        chronoStart: 0,
        chronoStop: 0,
        alarmTime: 0,
        missionElapsed: 0
    },
    states: {
        connect: {
            initial: 'disconnected',
            states: {
                disconnected: {
                    initial: 'powerOff',
                    on: {
                        CONNECT: 'connected',
                    },
                    states: {
                        powerOn: {
                            on: {
                                POWER_OFF: 'powerOff'
                            }
                        },
                        powerOff: {
                            on: {
                                POWER_ON: 'powerOn'
                            }
                        }
                    }
                },
                connected: {
                    initial: 'powerOff',
                    on: {
                        DISCONNECT: 'disconnected'
                    },
                    states: {
                        powerOn: {
                            invoke: {
                                src: context => cb => {
                                    const interval = setInterval(() => {
                                        cb('TICK');
                                    }, 1000 * context.interval);

                                    return () => {
                                        clearInterval(interval);
                                    };
                                }
                            },
                            on: {
                                POWER_OFF: 'powerOff'
                            }
                        },
                        powerOff: {
                            on: {
                                POWER_ON: 'powerOn'
                            }
                        }
                    }
                }
            }
        },
        time_adjust: {
            initial: 'clock_time_adjust',
            states: {
                clock_time_adjust: {
                    on: {
                        TOGGLE_TIME_ADJUST: 'mission_time_adjust'
                    }
                },
                mission_time_adjust: {
                    on: {
                        TOGGLE_TIME_ADJUST: 'clock_time_adjust'
                    }
                },
            }
        },
        chrono: {
            initial: 'reset',
            states: {
                stopped: {
                    on: {
                        CHRONO_RESET: {
                            target: 'reset',
                            actions: assign({
                                chronoStart: _ => 0,
                                chronoStop: _ => 0
                            })
                        }
                    }
                },
                started: {
                    on: {
                        CHRONO_STOP: {
                            target: 'stopped',
                            actions: assign({
                                chronoStop: context => context.elapsed
                            })
                        }
                    }
                },
                reset: {
                    on: {
                        CHRONO_START: {
                            target: 'started',
                            actions: assign({
                                chronoStart: context => context.elapsed
                            })
                        }
                    }
                }
            },
            on: {
                TICK: {
                    actions: () => {
                        //console.log('chrono tick')
                    }
                }
            },
        },
        mission_timer: {
            initial: 'idle',
            states: {
                idle: {
                    on: {
                        MISSION_TIMER_RESET: 'reset'
                    }
                },
                reset: {
                    on: {
                        '': 'idle'
                    }
                }
            },
            on: {
                TICK: {
                    actions: () => {
                        //console.log('mission_timer tick')
                    }
                }
            }
        },
        device: {
            on: {
                TICK: {
                    actions: assign({
                        elapsed: context => +(context.elapsed + context.interval).toFixed(2)
                    })
                }
            },
        },
        alarm: {
            initial: 'idle',
            states: {
                idle: {
                    on: {
                        ALARM_ON: 'alarmOn'
                    }
                },
                alarmOn: {
                    on: {
                        TICK: [
                            {
                                target: 'alarmSound',
                                cond: {
                                    type: 'alarmTimeReached'
                                }
                            }
                        ],
                        ALARM_OFF: 'idle'
                    }
                },
                alarmSound: {
                    activities: ['soundTheAlarm'],
                    on: {
                        ALARM_OFF: 'idle'
                    }
                }
            }
        }
    }
}, { ...options });

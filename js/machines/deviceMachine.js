const { assign, send } = XState; // global variable: window.XState

export const deviceMachineDesc = {
    id: 'soyuzClock',
    type: 'parallel',
    context: {
        elapsed: 0,
        duration: 5,
        interval: .5,
        chronoStart: 0,
        chronoStop: 0,
        alarmTime: 0,
        missionElapsed: 0,
        isConnected: false,
        isPowerOn: false
    },
    on: {
        UPDATE_CLOCK: {
            actions: assign({
                elapsed: (context, event, meta) => {
                    return event.delta
                }
            })
        },
        UPDATE_ALARM: {
            actions: assign({
                alarmTime: (context, event) => {
                    return event.delta
                }
            })
        },
        on: {
            TICK: {
                actions: assign({
                    elapsed: context => +(context.elapsed + context.interval).toFixed(2)
                })
            }
        },
    },
    states: {
        power: {
            id: 'power',
            initial: 'powerOff',
            states: {
                powerOn: {
                    invoke: {
                        src: context => callback => {

                            if (context.isConnected) {

                                const interval = setInterval(() => {
                                    callback('soyuzClock.TICK');
                                }, 1000 * context.interval);

                                return () => {
                                    clearInterval(interval);
                                };
                            }
                        },
                    },
                    on: {
                        POWER_ON: 'powerOn',
                        POWER_OFF: {
                            actions: assign({
                                isPowerOn: false
                            }),
                            target: 'powerOff'
                        }
                    }
                },
                powerOff: {
                    on: {
                        POWER_ON: {
                            actions: assign({
                                isPowerOn: true
                            }),
                            target: 'powerOn'
                        }
                    }
                }
            },
        },
        connect: {
            id: 'connect',
            initial: 'disconnected',
            states: {
                disconnected: {
                    invoke: {
                        src: context => callback => context.isPowerOn && callback('POWER_ON')
                    },
                    on: {
                        TOGGLE_CONNECT: {
                            actions: assign({
                                isConnected: true
                            }),
                            target: 'connected',
                        }
                    }
                },
                connected: {
                    invoke: {
                        src: context => callback => context.isPowerOn && callback('POWER_ON')
                    },
                    on: {
                        TOGGLE_CONNECT: {
                            actions: assign({
                                isConnected: false
                            }),
                            target: 'disconnected'
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
};

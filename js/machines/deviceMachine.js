const { assign } = XState; // global variable: window.XState

export const deviceMachineDesc = {
    id: 'device',
    initial: 'disconnected',
    context: {
        elapsed: 0,
        duration: 5,
        interval: .5,
        chronoStart: 0,
        chronoStop: 0,
        alarmTime: 0,
        missionElapsed: 0
    },
    on: {
        TICK: {
            actions: assign({
                elapsed: context => +(context.elapsed + context.interval).toFixed(2)
            })
        },
        UPDATE_CLOCK: {
            actions: assign({
                elapsed: (context, event) => {
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
    },
    states: {
        disconnected: {
            on: {
                CONNECT: 'connected',
            }
        },
        connected: {
            initial: 'deviceOff',
            states: {
                deviceOn: {
                    type: 'parallel',
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
                    states: {
                        device: {
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
                                }
                            }
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
                        clock: {
                            on: {
                                TICK: {
                                    actions: assign({
                                        elapsed: context => +(context.elapsed + context.interval).toFixed(2)
                                    })
                                }
                            },
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
                    },
                    on: {
                        TURN_OFF: 'deviceOff',
                    }
                },
                deviceOff: {
                    type: 'parallel',
                    states: {
                        clock: {
                            initial: 'idle',
                            states: {
                                idle: {
                                }
                            },
                            on: {
                                TICK: {
                                    actions: assign({
                                        elapsed: context => +(context.elapsed + context.interval).toFixed(2)
                                    })
                                }
                            },
                        },
                        chrono: {
                            initial: 'idle',
                            states: {
                                idle: {
                                    on: {
                                        CHRONO_RESET: 'reset'
                                    }
                                },
                                stop: {
                                    on: {
                                        CHRONO_RESET: 'reset'
                                    }
                                },
                                running: {
                                    on: {
                                        CHRONO_STOP: 'stop'
                                    }
                                },
                                start: {
                                    on: {
                                        '': 'running'
                                    }
                                },
                                reset: {
                                    on: {
                                        '': 'idle'
                                    }
                                }
                            }
                        },
                        alarm: {
                            initial: 'idle',
                            states: {
                                idle: {
                                    on: {
                                        ALARM_SET: 'idle'
                                    }
                                }
                            }
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
                            }
                        }
                    },
                    on: {
                        TURN_ON: 'deviceOn'
                    }
                }
            },
            on: {
                DISCONNECT: 'disconnected'
            }
        }
    }
};

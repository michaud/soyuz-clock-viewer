const { assign } = XState; // global variable: window.XState

export const deviceMachineDesc = {
    id: 'device',
    initial: 'disconnected',
    context: {
        elapsed: 0,
        duration: 5,
        interval: .5,
        chronometerStart: 0,
        alarmElapsed: 0,
        missionElapsed: 0
    },
    states: {
        disconnected: {
            on: {
                CONNECT: 'connected'
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
                            initial: 'idle',
                            states: {
                                idle: {
                                    on: {
                                        CHRONO_START: {
                                            target: 'start',
                                            actions: assign({
                                                chronometerStart: context => context.elapsed
                                            })
                                        }                                            
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
                                        '': {
                                            target: 'idle',
                                            actions: assign({
                                                chronometerStart: 0
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
                                        ALARM_OFF: 'idle'
                                    }
                                }
                            },
                            on: {
                                TICK: {
                                    actions: () => {
                                        //console.log('alarm tick')
                                    }
                                }
                            }
                        },
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
                                    on: {
                                        CLOCK_ADVANCE: 'advance'
                                    }
                                },
                                advance: {
                                    on: {
                                        '': 'idle',
                                        actions: []
                                    }
                                },
                                setTime: {

                                }
                            }
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

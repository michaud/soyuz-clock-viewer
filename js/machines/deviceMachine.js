const { assign, send } = XState; // global variable: window.XState

export const deviceMachineDesc = {
    id: 'soyuzClock',
    type: 'parallel',
    context: {
        clockTime: 0,
        interval: .5,
        chronoStart: 0,
        chronoStop: 0,
        alarmTime: 86400,
        missionElapsed: 0, //863990
        isConnected: false,
        isPowerOn: false
    },
    on: {
        UPDATE_CLOCK: {
            actions: ['updateClockTime']
        },
        UPDATE_MISSION_TIME: {
            actions: ['updateMissionTime']
        },
        UPDATE_ALARM: {
            actions: ['updateAlarmTime']
        }
    },
    states: {
        power: {
            id: 'power',
            initial: 'powerOff',
            on: {
                TICK: {
                    actions: ['advanceClockTime', 'advanceMissionTime']
                }
            },
            states: {
                powerOn: {
                    invoke: { src: 'startTick' },
                    on: {
                        POWER_ON: 'powerOn',
                        POWER_OFF: {
                            actions: ['setPowerOff'],
                            target: 'powerOff'
                        }
                    }
                },
                powerOff: {
                    on: {
                        POWER_ON: {
                            actions: ['setPowerOn'],
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
                    invoke: { src: 'bumpPowerOn' },
                    on: {
                        TOGGLE_CONNECT: {
                            actions: ['setIsConnected'],
                            target: 'connected',
                        }
                    }
                },
                connected: {
                    invoke: { src: 'bumpPowerOn' },
                    on: {
                        TOGGLE_CONNECT: {
                            actions: ['setIsDisconnected'],
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
                    on: { TOGGLE_TIME_ADJUST: 'mission_time_adjust' }
                },
                mission_time_adjust: {
                    on: { TOGGLE_TIME_ADJUST: 'clock_time_adjust' }
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
                            actions: ['resetChrono']
                        }
                    }
                },
                started: {
                    on: {
                        CHRONO_STOP: {
                            target: 'stopped',
                            actions: ['setChronoStopTime']
                        }
                    }
                },
                reset: {
                    on: {
                        CHRONO_START: {
                            target: 'started',
                            actions: ['setChronoStartTime']
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
                    on: { MISSION_TIMER_RESET: 'reset' }
                },
                reset: {
                    on: { '': 'idle' }
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
                    on: { ALARM_ON: 'alarmOn' }
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
                    on: { ALARM_OFF: 'idle' }
                }
            }
        }
    }
};

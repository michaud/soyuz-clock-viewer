const deviceMachine = Machine({
    id: 'device',
    initial: 'disconnected',
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
                                TICK: ''
                            }
                        },
                        clock: {
                            on: {
                                TICK: ''
                            }
                        },
                        chrono: {
                            initial: 'idle',
                            states: {
                                idle: {
                                    on: {
                                        CHRONO_START: 'start'
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
                            },
                            on: {
                                TICK: ''
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
                                        ALARM_OFF: 'idle'
                                    }
                                }
                            },
                            on: {
                                TICK: ''
                            }
                        },
                    },
                    on: {
                        TURN_OFF: 'deviceOff'
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
});

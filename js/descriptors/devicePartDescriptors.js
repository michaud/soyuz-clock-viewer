export const devicePartDescriptors = [
    {
        component: "device",
        type: "buttons",
        name: "switch_device_on_off",
        action: "switch_device_on_offAction",
        command: "toggle_device_on_off",
        over: "switch_device_on_off"
    },
    {
        component: "device",
        type: "buttons",
        name: "time_adjust",
        move: "time_adjust",
        up: "time_adjust",
        over: "time_adjust",
        action: "time_adjust_toggleAction",
        command: "time_adjust"
    },
    {
        component: "device",
        type: "buttons",
        name: "connector_plug",
        action: "connector_plugAction",
        command: "connect_device",
    },
    {
        component: "chronometer",
        type: "hands",
        name: "chronometer_indicator_minutes",
        time: "minute"
    },
    {
        component: "chronometer",
        type: "hands",
        name: "chronometer_indicator_seconds",
        time: "second"
    },
    {
        component: "chronometer",
        type: "hands",
        name: "chronometer_indicator_hours",
        time: "hour"
    },
    {
        component: "chronometer",
        type: "buttons",
        name: "start_stop_clear_button",
        action: "start_stop_clear_buttonAction",
        command: "troggle_start_stop_clear",
        over: "start_stop_clear_button"
    },
    {
        component: "clock",
        type: "buttons",
        name: "advance_second_hand",
        action: "advance_second_handAction",
        command: "advance_second_hand",
        up: "advance_second_hand",
        over: "advance_second_hand_object"
    },
    {
        component: "clock",
        type: "hands",
        name: "dial_indicator_seconds",
        time: "second"
    },
    {
        component: "clock",
        type: "hands",
        name: "dial_indicator_minutes",
        time: "minute"
    },
    {
        component: "clock",
        type: "hands",
        name: "dial_indicator_hours",
        time: "hour"
    },
    {
        component: "alarm",
        type: "hands",
        name: "alarm_hand_minutes",
        time: "minute"
    },
    {
        component: "alarm",
        type: "hands",
        name: "alarm_hand_hours",
        time: "hour"
    },
    {
        component: "alarm",
        type: "buttons",
        name: "switch_alarm_on_off",
        action: "switch_alarm_on_offAction",
        command: "switch_alarm_on_off",
        over: "switch_alarm_on_off"
    },
    {
        component: "alarm",
        type: "buttons",
        name: "alarm_adjust_nob",
        move: "alarm_adjust_nob",
        up: "alarm_adjust_nob",
        over: "alarm_adjust_nob"
    },
    {
        component: "mission_timer",
        type: "hands",
        name: "mission_clock_day_deca",
        time: "day"
    },
    {
        component: "mission_timer",
        type: "hands",
        name: "mission_clock_day_digit",
        time: "day"
    },
    {
        component: "mission_timer",
        type: "hands",
        name: "mission_clock_hours",
        time: "hour"
    },
    {
        component: "mission_timer",
        type: "hands",
        name: "mission_clock_minutes_deca",
        time: "minute"
    },
    {
        component: "mission_timer",
        type: "hands",
        name: "mission_clock_minutes_digit",
        time: "minute"
    },
    {
        component: "mission_timer",
        type: "buttons",
        name: "clear_to_zero_nob",
        command: "clear_to_zero_nob",
        move: "clear_to_zero_nob",
        up: "clear_to_zero_nob",
        over: "clear_to_zero_nob"
    },
];

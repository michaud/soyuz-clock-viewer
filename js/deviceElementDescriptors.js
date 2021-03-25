export const deviceElementDescriptors = [
    {
        device: "device",
        type: "buttons",
        name: "switch_device_on_off",
        action: "switch_device_on_offAction",
        command: "toggle_device_on_off"
    },
    {
        device: "device",
        type: "buttons",
        name: "connector_plug",
        action: "connector_plugAction",
        command: "connect_device"
    },
    {
        device: "chronometer",
        type: "hands",
        name: "chronometer_indicator_minutes",
        time: "minute"
    },
    {
        device: "chronometer",
        type: "hands",
        name: "chronometer_indicator_seconds",
        time: "second"
    },
    {
        device: "chronometer",
        type: "hands",
        name: "chronometer_indicator_hours",
        time: "hour"
    },
    {
        device: "clock",
        type: "buttons",
        name: "advance_second_hand",
        action: "advance_second_handAction",
        command: "advance_second_hand"
    },
    {
        device: "clock",
        type: "hands",
        name: "dial_indicator_seconds",
        time: "second"
    },
    {
        device: "clock",
        type: "hands",
        name: "dial_indicator_minutes",
        time: "minute"
    },
    {
        device: "clock",
        type: "hands",
        name: "dial_indicator_hours",
        time: "hour"
    },
    {
        device: "alarm",
        type: "hands",
        name: "alarm_indicator_minutes",
        time: "minute"
    },
    {
        device: "alarm",
        type: "hands",
        name: "alarm_indicator_hours",
        time: "hour"
    },
    {
        device: "alarm",
        type: "buttons",
        name: "switch_alarm_on_off",
        action: "switch_alarm_on_offAction"
    },

    {
        device: "mission_timer",
        type: "hands",
        name: "mission_clock_day_deca",
        time: "day"
    },
    {
        device: "mission_timer",
        type: "hands",
        name: "mission_clock_day_digit",
        time: "day"
    },
    {
        device: "mission_timer",
        type: "hands",
        name: "mission_clock_hours",
        time: "hour"
    },
    {
        device: "mission_timer",
        type: "hands",
        name: "mission_clock_minutes_deca",
        time: "minute"
    },
    {
        device: "mission_timer",
        type: "hands",
        name: "mission_clock_minutes_digit",
        time: "minute"
    }
];

import {
    CONST,
    calculateAlarmAdjustTime
} from '../utils/index.js';

export const alarmAdjustMove = (
    pointerDownX,
    clientX,
    clientY,
    deviceService,
    movementY,
    scene
) => {

    const hilite = scene.getObjectByName('alarm_adjust_rotation_overlay');
    const scaleOverlayHours = scene.getObjectByName('overlay_alarm_rotate_hours_bg');
    const scaleOverlayMinutes = scene.getObjectByName('overlay_alarm_rotate_minute_bg');
    const scaleOverlaySeconds = scene.getObjectByName('overlay_alarm_rotate_sec_bg');

    let bias = 20;

    const deltaX = pointerDownX - clientX;

    const absDeltaX = Math.abs(deltaX);

    if(absDeltaX <= 90) {

        scaleOverlaySeconds.material.color.g = .5;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;

    } else if(absDeltaX > 90 && absDeltaX <= 180) {

        bias = 10;
        scaleOverlaySeconds.material.color.g = 0;
        scaleOverlayMinutes.material.color.g = .5;
        scaleOverlayHours.material.color.g = 0;

    } else if(absDeltaX > 180) {

        bias = 0.1;
        scaleOverlaySeconds.material.color.g = 0;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = .5;

    } else {

        scaleOverlaySeconds.material.color.g = 0;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;
    }

    if(movementY < 0) {

        let time = calculateAlarmAdjustTime(
            deviceService.state.context.alarmTime,
            CONST.secondsInDay,
            movementY,
            bias
        );

        deviceService.send('UPDATE_ALARM', { delta: time })
    
        hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
    }
};

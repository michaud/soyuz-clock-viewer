import { CONST } from '../utils/index.js';

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

    let bias = 40;

    const deltaX = pointerDownX - clientX;

    const absDeltaX = Math.abs(deltaX);

    if(absDeltaX <= 90) {

        scaleOverlaySeconds.material.color.g = .5;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;

    } else if(absDeltaX > 90 && absDeltaX <= 180) {

        bias = 20;
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

        let delta = deviceService.state.context.alarmTime - (Math.abs((CONST.TWO_PI * movementY) / bias));
        //keep between 0 and a day
        delta = delta < 0 ? CONST.secondsInDay - Math.abs(delta) : delta;

        deviceService.send('UPDATE_ALARM', { delta })
    
        hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
    }
};

import {
    CONST,
    calculateAlarmAdjustTime
} from '../utils/index.js';

const clockTimeAdjust = (
    pointerDownX,
    clientX,
    clientY,
    deviceService,
    movementY,
    scene
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');

    const scaleOverlayHours = scene.getObjectByName('overlay_clock_rotate_hours_bg');
    const scaleOverlayMinutes = scene.getObjectByName('overlay_clock_rotate_minutes_bg');
    const scaleOverlaySeconds = scene.getObjectByName('overlay_clock_rotate_seconds_bg');

    const biasSize = 40;
    const biasDepth = biasSize - .2;

    const deltaX = pointerDownX - clientX;

    const absDeltaX = Math.abs(deltaX);

    if(absDeltaX <= 90) {

        scaleOverlaySeconds.material.color.g = .5;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;

    } else if(absDeltaX > 90 && absDeltaX <= 180) {

        scaleOverlaySeconds.material.color.g = 0;
        scaleOverlayMinutes.material.color.g = .5;
        scaleOverlayHours.material.color.g = 0;

    } else if(absDeltaX > 180) {

        scaleOverlaySeconds.material.color.g = 0;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = .5;

    } else {

        scaleOverlaySeconds.material.color.g = 0;
        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;
    }

    const bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);

    const biasAdjusted = (CONST.TWO_PI * movementY) / (biasSize - bias);
    let delta = deviceService.state.context.clockTime - biasAdjusted;
    //keep between within a day
    delta = delta > CONST.secondsInDay ? delta - CONST.secondsInDay : delta;
    delta = delta < 0 ? delta + CONST.secondsInDay : delta;
    //round to nearest half a second
    delta = Math.round(delta * 2) / 2;

    deviceService.send('UPDATE_CLOCK', { delta })

    if(movementY > 0) {

        const alarmTime = calculateAlarmAdjustTime(
            deviceService.state.context.alarmTime,
            CONST.secondsInDay,
            movementY,
            bias
        );

        deviceService.send('UPDATE_ALARM', { delta: alarmTime })
    }

    hilite.rotation.set(0, delta / 100, 0, 'XYZ');
};

const missionTimeAdjust = (
    pointerDownX,
    clientX,
    clientY,
    deviceService,
    movementY,
    scene
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');

    const scaleOverlayDays = scene.getObjectByName('overlay_mission_rotate_days_bg');
    const scaleOverlayHours = scene.getObjectByName('overlay_mission_rotate_hours_bg');
    const scaleOverlayMinutes = scene.getObjectByName('overlay_mission_rotate_minutes_bg');

    const biasSize = 20;
    const biasDepth = biasSize - .2;

    const deltaX = pointerDownX - clientX;

    const absDeltaX = Math.abs(deltaX);

    if(absDeltaX <= 90) {

        scaleOverlayMinutes.material.color.g = .5;
        scaleOverlayHours.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;

    } else if(absDeltaX > 90 && absDeltaX <= 180) {

        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = .5;
        scaleOverlayDays.material.color.g = 0;

    } else if(absDeltaX > 180) {

        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;
        scaleOverlayDays.material.color.g = .5;

    } else {

        scaleOverlayMinutes.material.color.g = 0;
        scaleOverlayHours.material.color.g = 0;
        scaleOverlayDays.material.color.g = 0;
    }

    let bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);

    let delta = deviceService.state.context.missionElapsed + ((CONST.TWO_PI * Math.abs(movementY)) / (biasSize - bias));
    delta = delta > CONST.secondsIn99Days ? CONST.secondsIn99Days - delta : delta;
    delta = Math.round(delta * 2) / 2;

    deviceService.send('UPDATE_MISSION_TIME', { delta })

    hilite?.rotation.set(0, delta / 100, 0, 'XYZ');
};

const timeAdjust = {
    clock_time_adjust: clockTimeAdjust,
    mission_time_adjust: missionTimeAdjust
}

export const timeAdjustMove = (
    pointerDownX,
    clientX,
    clientY,
    deviceService,
    movementY,
    scene
) => {

    timeAdjust[deviceService.state.value.time_adjust](
        pointerDownX,
        clientX,
        clientY,
        deviceService,
        movementY,
        scene
    )
};

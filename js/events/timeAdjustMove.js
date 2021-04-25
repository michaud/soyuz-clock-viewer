import {
    CONST,
    calculateAlarmAdjustTime
} from '../utils/index.js';

const clockTimeAdjust = (
    pointerDownX,
    clientX,
    _,
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
    let time = deviceService.state.context.clockTime - biasAdjusted;
    //keep between within a day
    time = time >= CONST.secondsInDay ? time - CONST.secondsInDay : time;
    time = time < 0 ? time + CONST.secondsInDay : time;
    //round to nearest half a second
    time = Math.round(time * 2) / 2;

    deviceService.send('UPDATE_CLOCK', { time })

    if(movementY > 0) {

        const alarmTime = calculateAlarmAdjustTime(
            deviceService.state.context.alarmTime,
            CONST.secondsInDay,
            movementY,
            bias
        );

        deviceService.send('UPDATE_ALARM', { time: alarmTime })
    }

    hilite.rotation.set(0, time / 100, 0, 'XYZ');
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

    if(deviceService.state.value.clock === 'near_zero') {

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
    
        let time = deviceService.state.context.missionElapsed + ((CONST.TWO_PI * Math.abs(movementY)) / (biasSize - bias));
        time = time > CONST.secondsIn99Days ? CONST.secondsIn99Days - time : time;
        time = Math.round(time * 2) / 2;
    
        deviceService.send('UPDATE_MISSION_TIME', { time })
    
        hilite?.rotation.set(0, time / 100, 0, 'XYZ');

    } else {

        hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
    }

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

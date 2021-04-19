import { CONST } from '../utils/index.js';

const clockTimeAdjust = (
    pointerDownX,
    clientX,
    clientY,
    deviceService,
    movementY,
    scene
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
    const biasSize = 40;
    const biasDepth = biasSize - .2;

    const deltaX = pointerDownX - clientX;
    const bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);
    let delta = deviceService.state.context.clockTime - ((CONST.TWO_PI * movementY) / (biasSize - bias));
    delta = delta > CONST.secondsInDay ? delta - CONST.secondsInDay : delta;

    deviceService.send('UPDATE_CLOCK', { delta })

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
    const biasSize = 20;
    const biasDepth = biasSize - .2;

    const deltaX = pointerDownX - clientX;
    const bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);
    let delta = deviceService.state.context.missionElapsed + ((CONST.TWO_PI * Math.abs(movementY)) / (biasSize - bias));
    delta = delta > CONST.secondsIn99Days ? CONST.secondsIn99Days - delta : delta;

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

import {
    CONST,
    calculateAlarmAdjustTime
} from '../utils/index.js';

export const missionResetMove = (
    pointerDownX,
    clientX,
    clientY,
    deviceService,
    movementY,
    scene
) => {

    const hilite = scene.getObjectByName('mission_reset_rotation_overlay');
    const biasSize = 20;
    const biasDepth = biasSize - .2;

    const deltaX = pointerDownX - clientX;

    let bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);
    
    let delta = ((CONST.TWO_PI * Math.abs(movementY)) / (biasSize - bias));

    if (clientY < 100 ) deviceService.send('UPDATE_MISSION_TIME', { delta : 0 });

    hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
};

import { CONST } from '../utils/index.js';

export const timeAdjustMove = (
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

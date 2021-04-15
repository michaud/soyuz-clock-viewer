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
    const biasSize = 40;
    const biasDepth = biasSize - .1;

    const deltaX = pointerDownX - clientX;

    if(movementY < 0) {

        const bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);

        let delta = deviceService.state.context.alarmTime - (Math.abs((CONST.TWO_PI * movementY) / (biasSize - bias)));
        delta = delta < 0 ? CONST.secondsInDay - Math.abs(delta) : delta;

        deviceService.send('UPDATE_ALARM', { delta })
    
        hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
    }
};

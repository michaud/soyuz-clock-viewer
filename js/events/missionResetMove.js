import {
    CONST
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

    if (clientY < 100 ) deviceService.send('UPDATE_MISSION_TIME', { time : 0 });

    hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
};

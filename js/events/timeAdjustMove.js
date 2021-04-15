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
    const delta = deviceService
        .state.context.clockTime - (((2 * Math.PI) * movementY) / (biasSize - bias));

    deviceService.send('UPDATE_CLOCK', { delta })

    hilite.rotation.set(0, delta / 100, 0, 'XYZ');
};

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
        const delta = deviceService.state.context
            .alarmTime - Math.abs((((2 * Math.PI) * movementY) / (biasSize - bias)));
    
        deviceService.send('UPDATE_ALARM', { delta })
    
        hilite?.rotation.set(0, clientY / 100, 0, 'XYZ');
    }
};

export const initPicking = (
    raycaster,
    devices,
    scene,
    container,
    controls,
    deviceService
) => {

    let rotationOverlay;
    let isPointerDown = false;
    let pointerDownY = 0;
    let pointerDownX = 0;
    let button;
    const biasSize = 40;
    const biasDepth = biasSize - .1;

    const onPointerDown = (raycaster, devices, scene) => (e) => {

        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
        isPointerDown = true;

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {

            controls.enabled = false;
            button = devices['device'].buttons.find(button => intersects[0].object.name.includes(button.name));

            if(intersects[0].object.name.includes('time_adjust')) {
                const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
                rotationOverlay = hilite;
            }
        }
    };

    container.addEventListener('pointerdown', onPointerDown(raycaster, devices, scene));

    const onPointerMove = (raycaster, devices, scene) => (e) => {

        if(isPointerDown && button) {

            const {
                clientX,
                clientY,
                movementY,
            } = e;

            const deltaX = pointerDownX - clientX;
            const bias = Math.min(Math.max(1, Math.abs(deltaX) - biasSize), biasDepth);
            const delta = deviceService.state.context
                .elapsed - (((2 * Math.PI) * movementY) / (biasSize - bias));

            deviceService.send('UPDATE_CLOCK', {delta})

            rotationOverlay.rotation.set(0, clientY / 100, 0, 'XYZ');
        }
    };

    container.addEventListener('pointermove', onPointerMove(raycaster, devices, scene));

    const onPointerUp = (raycaster, devices, scene, controls) => (e) => {

        isPointerDown = false;
        controls.enabled = true;

        const {
            clientY
        } = e;

        const intersects = raycaster.intersectObjects(scene.children, true);
        console.log('up button:', button)
        if (intersects.length > 0) {

            if(intersects[0].object.name.includes('time_adjust')) {

                if(Math.abs(clientY - pointerDownY) < 5) {

                    deviceService.send('TOGGLE_TIME_ADJUST');
                }
            }

            if(button) {
                button.action()
                button = undefined;
            }
        }
    }
    
    container.addEventListener('pointerup', onPointerUp(raycaster, devices, scene, controls));
};

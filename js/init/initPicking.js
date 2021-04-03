 export const initPicking = (raycaster, devices, scene, container, controls, deviceService) => {

    let rotationOverlay;
    let isPointerDown = false;
    let pointerDownY = 0;
    let button;

    const onPointerUp = (raycaster, devices, scene, controls) => () => {

        isPointerDown = false;
        controls.enabled = true;
        button = undefined;

        const intersects = raycaster.intersectObjects(scene.children, true);
    
        if (intersects.length > 0) {

            let button;

            for(let device in devices) {

                const test = devices[device]
                    .buttons
                    .find(button => intersects[0].object.name.includes(button.name));

                if(test) {
                    button = test;
                } 
            }

            if(button) button.action()
        }
    }
    
    container.addEventListener('pointerup', onPointerUp(raycaster, devices, scene, controls));

    const onPointerDown = (raycaster, devices, scene) => (e) => {

        pointerDownY = e.clientY;
        isPointerDown = true;

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {

            if(intersects[0].object.name.includes('time_adjust')) {

                controls.enabled = false;
                button = devices['device'].buttons.find(button => button.name === intersects[0].object.name);
                const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
                rotationOverlay = hilite;
            }
        }
    };

    container.addEventListener('pointerdown', onPointerDown(raycaster, devices, scene));

    const onPointerMove = (raycaster, devices, scene) => (e) => {

        if(isPointerDown && button) {
            const {
                clientY,
                view: {
                    screen: {
                        availHeight
                    }
                }
            } = e;

            
            const delta = pointerDownY - clientY;
            const scaled = (10 / availHeight) * delta;
            deviceService.send('UPDATE_CLOCK', { delta: deviceService.state.context.elapsed + ((2 * Math.PI) * scaled) })
            rotationOverlay.rotation.set(0,(2 * Math.PI) * scaled,0, 'XYZ');
            //console.log('delta', delta)
        }
    };

    container.addEventListener('pointermove', onPointerMove(raycaster, devices, scene));
};

export const initPicking = (
    raycaster,
    device,
    scene,
    container,
    controls,
    deviceService
) => {

    let isPointerDown = false;
    let pointerDownY = 0;
    let pointerDownX = 0;
    let button;
    let overButton;
    let prevOverButton;

    const onPointerDown = e => {

        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
        isPointerDown = true;

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {

            button = device.buttons[intersects[0].object?.userData.hit_target];

            if(button) controls.enabled = false;
        }
    };

    container.addEventListener('pointerdown', onPointerDown);

    const onPointerMove = e => {
        
        const {
            clientX,
            clientY,
            movementY,
        } = e;

        if(isPointerDown) {

            if(button?.move) {

                button.move(
                    pointerDownX,
                    clientX,
                    clientY,
                    deviceService,
                    movementY,
                    scene
                )
            }

        } else {

            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {

                if(!overButton) {

                    overButton = device.buttons[intersects[0].object?.userData.hit_target];
                    overButton?.pointerOver && overButton.pointerOver(scene, deviceService, true);

                } else {

                    prevOverButton = overButton;
                    prevOverButton?.pointerOver && prevOverButton.pointerOver(scene, deviceService, false);

                    overButton = device.buttons[intersects[0].object?.userData.hit_target];
                    overButton?.pointerOver && overButton.pointerOver(scene, deviceService, true);
                }

            } else {

                overButton?.pointerOver && overButton.pointerOver(scene, deviceService, false);
                prevOverButton?.pointerOver && prevOverButton.pointerOver(scene, deviceService, false);

                overButton = undefined;
                prevOverButton = undefined;
            }
        }
    };

    container.addEventListener('pointermove', onPointerMove);

    const onPointerUp = e => {

        const {
            clientX,
            clientY,
        } = e;

        controls.enabled = true;

        const isPointerMove = Math.abs(pointerDownY - clientY) > 5;
        button?.action && button.action(isPointerMove);
        button?.pointerUp && button.pointerUp(isPointerMove, deviceService);

        isPointerDown = false;

        button = undefined;
    }
    
    container.addEventListener('pointerup', onPointerUp);
};

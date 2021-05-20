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

            button?.move?.(
                pointerDownX,
                clientX,
                clientY,
                deviceService,
                movementY,
                scene
            )

        } else {

            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {

                if(!overButton) {
                    //new overbutton
                    overButton = device.buttons[intersects[0].object?.userData.hit_target];
                    overButton?.pointerOver?.(scene, deviceService, true, container);

                } else {
                    //prev overbutton
                    //reset prev
                    prevOverButton = overButton;
                    prevOverButton?.pointerOver?.(scene, deviceService, false, container);
                    //set new
                    overButton = device.buttons[intersects[0].object?.userData.hit_target];
                    overButton?.pointerOver?.(scene, deviceService, true, container);
                }

            } else {

                //reset prev and current
                overButton?.pointerOver?.(scene, deviceService, false, container);
                prevOverButton?.pointerOver?.(scene, deviceService, false, container);

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
        button?.action?.(isPointerMove);
        button?.pointerUp?.(isPointerMove, deviceService, scene);

        isPointerDown = false;

        button = undefined;
    }
    
    container.addEventListener('pointerup', onPointerUp);
};

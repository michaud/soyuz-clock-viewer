 export const initPicking = (raycaster, devices, scene, container) => {

    const onPointerUp = (raycaster, devices, scene) => () => {

        const intersects = raycaster.intersectObjects(scene.children, true);
    
        if (intersects.length > 0) {

            let button;

            for(let device in devices) {

                const test = devices[device].buttons.find(button => {
                    return intersects[0].object.name.includes(button.name);
                });

                if(test) {
                    button = test;
                } 
            }

            if(button) button.action()
        }
    }
    
    container.addEventListener('pointerup', onPointerUp(raycaster, devices, scene));
};

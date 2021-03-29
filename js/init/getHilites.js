import { hiliteDescriptors } from '../descriptors/hiliteDescriptors.js';

export const getHilites = (scene, hilites) => {

    const sceneGroup = scene.children[0];

    const overlay = sceneGroup?.children[0].children[1].children.find(item => item.name === 'overlay_target');
    const hitTargets = sceneGroup?.children[0].children[1].children.find(item => item.name === 'hit_target');

    hiliteDescriptors.forEach(item => {

        const hitFound = hitTargets?.children.find(child => child.name === item.name);
        const overlayFound = overlay?.children.find(child => child.name === item.target);

        if (hitFound && overlayFound) {

            overlayFound.visible = false;

            hilites.push({
                ...item,
                hit: hitFound,
                target: overlayFound
            })
        }
    });
};

export const initUpdateHilites = (scene, raycaster) => {

    let hiliteTarget;

    return (hilites) => {

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {

            if (hiliteTarget != intersects[0].object && intersects[0].object.name.includes('hit')) {

                if (hiliteTarget) {

                    const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                    if (overlay) {

                        overlay.target.visible = hiliteTarget.currVisible;
                    }
                }

                hiliteTarget = intersects[0].object;

                const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                if (overlay) {

                    hiliteTarget.currVisible = overlay.target.visible;

                    overlay.target.visible = true;
                }
            }

        } else {

            if (hiliteTarget) {

                const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                if (overlay) {

                    overlay.target.visible = hiliteTarget.currVisible;
                }
            }

            hiliteTarget = null;
        }
    };
}

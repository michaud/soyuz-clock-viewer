import { hiliteDescriptors } from '../descriptors/hiliteDescriptors.js';

export const getHilites = (scene, hilites, state) => {

    const overlay = scene.getObjectByName('overlay_target');
    const hitTargets = scene.getObjectByName('hit_target');

    const timeAdjustHilite = scene.getObjectByName('time_adjust_rotation_overlay');
    timeAdjustHilite.visible = false;

    const alarmAdjustHilite = scene.getObjectByName('alarm_adjust_rotation_overlay');
    alarmAdjustHilite.visible = false;

    hiliteDescriptors.forEach(item => {

        const hitFound = hitTargets.getObjectByName(item.name);
        const overlayFound = overlay.getObjectByName(item.target);

        const domEl = document.querySelector(`[data-target=${item.element}`);

        if (hitFound && overlayFound) {

            overlayFound.visible = false;

            domEl.addEventListener('pointerover', (e) => {

                if(state.showHilite) {        
                    overlayFound.visible = true;
                }
            });

            domEl.addEventListener('pointerleave', (e) => {

                if(state.showHilite) {
                    overlayFound.visible = false;
                }
            });
    
            hilites.push({
                ...item,
                hit: hitFound,
                target: overlayFound,
                domEl
            })
        }
    });
};

export const initUpdateHilites = (scene, raycaster, state) => {

    let hiliteTarget;

    const hitTargets = scene.getObjectByName('hit_target');

    return hilites => {

        if(state.showHilite) {

            if(hitTargets.scale.x === 0) {
                hitTargets.scale.set(1,1,1)
            }

            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {

                if (hiliteTarget != intersects[0].object && intersects[0].object.name.includes('hit')) {

                    if (hiliteTarget) {

                        const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                        if (overlay) {

                            overlay.target.visible = hiliteTarget.currVisible;
                            overlay.domEl.classList.remove('hilite');
                        }
                    }

                    hiliteTarget = intersects[0].object;

                    const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                    if (overlay) {

                        hiliteTarget.currVisible = overlay.target.visible;

                        overlay.target.visible = true;
                        overlay.domEl.classList.add('hilite')
                    }
                }

            } else {

                if (hiliteTarget) {

                    const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                    if (overlay) {

                        overlay.target.visible = hiliteTarget.currVisible;
                        overlay.domEl.classList.remove('hilite')
                    }
                }

                hiliteTarget = null;
            }

        } else {

            if(hitTargets.scale.x === 1) hitTargets.scale.set(0,0,0);
        }
    };
};

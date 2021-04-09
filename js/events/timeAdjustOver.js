export const timeAdjustOver = (
    scene,
    visible
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
    hilite.visible = visible;
};

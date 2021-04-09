export const timeAdjustOver = (
    scene,
    visible
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
    if(hilite) hilite.visible = visible;
};

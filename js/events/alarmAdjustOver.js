export const alarmAdjustOver = (
    scene,
    visible
) => {

    const hilite = scene.getObjectByName('alarm_adjust_rotation_overlay');
    if(hilite) hilite.visible = visible;
};

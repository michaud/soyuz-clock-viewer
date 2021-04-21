export const alarmAdjustOver = (
    scene,
    _,
    visible
) => {

    const hilite = scene.getObjectByName('alarm_adjust_rotation_overlay');
    if(hilite) hilite.visible = visible;
    const scaleOverlay = scene.getObjectByName('overlay_alarm_rotate');
    if(scaleOverlay) scaleOverlay.visible = visible;
};

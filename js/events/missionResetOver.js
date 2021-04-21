export const missionResetOver = (
    scene,
    _,
    visible
) => {

    const hilite = scene.getObjectByName('mission_reset_rotation_overlay');
    if(hilite) hilite.visible = visible;
};

export const missionResetOver = (
    scene,
    _,
    visible,
    container
) => {

    const hilite = scene.getObjectByName('mission_reset_rotation_overlay');
    if(hilite) hilite.visible = visible;
    container.style.cursor = visible ? 'pointer' : 'move'; 
};

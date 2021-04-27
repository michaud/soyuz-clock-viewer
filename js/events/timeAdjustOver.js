export const timeAdjustOver = (
    scene,
    deviceService,
    visible,
    container
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
    if (hilite) hilite.visible = visible;

    const scaleClockOverlay = scene.getObjectByName('overlay_clock_rotate');        
    const scaleMissionOverlay = scene.getObjectByName('overlay_mission_rotate');        
    
    if(scaleClockOverlay && scaleMissionOverlay && deviceService.state.value.time_adjust === 'clock_time_adjust') {

        scaleClockOverlay.visible = visible;
        scaleMissionOverlay.visible = false;

    } else {

        scaleClockOverlay.visible = false;
        scaleMissionOverlay.visible = visible;
    }
    container.style.cursor = visible ? 'pointer' : 'move'; 
};

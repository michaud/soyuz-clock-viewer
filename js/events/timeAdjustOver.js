export const timeAdjustOver = (
    scene,
    deviceService,
    visible,
) => {

    const hilite = scene.getObjectByName('time_adjust_rotation_overlay');
    if (hilite) hilite.visible = visible;

    const scaleClockOverlay = scene.getObjectByName('overlay_clock_rotate');        
    const scaleMissioOverlay = scene.getObjectByName('overlay_mission_rotate');        
    
    if(scaleClockOverlay && scaleMissioOverlay && deviceService.state.value.time_adjust === 'clock_time_adjust') {

        scaleClockOverlay.visible = visible;
        scaleMissioOverlay.visible = false;

    } else {

        scaleClockOverlay.visible = false;
        scaleMissioOverlay.visible = visible;
    }
};

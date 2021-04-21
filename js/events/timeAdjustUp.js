export const timeAdjustUp = (
    isPointerMove,
    deviceService,
    scene
) => {

    const scaleClockOverlayHours = scene.getObjectByName('overlay_clock_rotate_hours_bg');
    const scaleClockOverlayMinutes = scene.getObjectByName('overlay_clock_rotate_minutes_bg');
    const scaleClockOverlaySeconds = scene.getObjectByName('overlay_clock_rotate_seconds_bg');

    scaleClockOverlaySeconds.material.color.g = 0;
    scaleClockOverlayMinutes.material.color.g = 0;
    scaleClockOverlayHours.material.color.g = 0;

    const scaleMissionOverlayDays = scene.getObjectByName('overlay_mission_rotate_days_bg');
    const scaleMissionOverlayHours = scene.getObjectByName('overlay_mission_rotate_hours_bg');
    const scaleMissionOverlayMinutes = scene.getObjectByName('overlay_mission_rotate_minutes_bg');

    scaleMissionOverlayMinutes.material.color.g = 0;
    scaleMissionOverlayHours.material.color.g = 0;
    scaleMissionOverlayDays.material.color.g = 0;

    const scaleClockOverlay = scene.getObjectByName('overlay_clock_rotate');        
    const scaleMissionOverlay = scene.getObjectByName('overlay_mission_rotate');        

    scaleClockOverlay.visible = false;
    scaleMissionOverlay.visible = false;

    if (!isPointerMove) deviceService.send('TOGGLE_TIME_ADJUST');
};

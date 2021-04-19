export const timeAdjustUp = (
    isPointerMove, deviceService
) => {

    if (isPointerMove) {

        deviceService.send('TOGGLE_TIME_ADJUST');
    }
};

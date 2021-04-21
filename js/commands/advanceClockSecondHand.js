export const advanceClockSecondHand = (deviceService) => () => {
    deviceService.send('ADVANCE_CLOCK')
};

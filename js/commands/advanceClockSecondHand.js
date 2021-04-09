export const advanceClockSecondHand = (deviceService) => () => {
    deviceService.send('TICK')
};

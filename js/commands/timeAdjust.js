export const timeAdjust = (deviceService) => () => {
console.log('timeAdjust:', timeAdjust)

    const eventName = '';

    deviceService.send(eventName);
};

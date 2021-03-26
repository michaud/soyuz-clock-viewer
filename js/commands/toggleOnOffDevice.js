export const toggleOnOffDevice = (deviceService) => () => {

    const eventName = deviceService?.state?.value?.connected?.deviceOff ?  'TURN_ON' : 'TURN_OFF';

    deviceService.send(eventName).value;
};

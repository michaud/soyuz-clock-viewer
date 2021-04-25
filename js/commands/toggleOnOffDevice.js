export const toggleOnOffDevice = (deviceService) => () => {

    const eventName = deviceService?.state?.value?.power === 'powerOff'
        ? 'POWER_ON' : 'POWER_OFF';

    deviceService.send(eventName);
};

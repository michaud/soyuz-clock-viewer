export const toggleOnOffDevice = (deviceService) => () => {

    const eventName = deviceService?.state?.value?.device === 'powerOff'
        ?  'POWER_ON' : 'POWER_OFF';

    deviceService.send(eventName);
};

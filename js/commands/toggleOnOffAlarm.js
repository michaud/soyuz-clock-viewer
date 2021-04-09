export const toggleOnOffAlarm = (deviceService) => () => {

    const eventName = deviceService?.state?.value?.connected?.deviceOn?.alarm === 'idle' ?  'ALARM_ON' : 'ALARM_OFF';
    deviceService.send(eventName);
};

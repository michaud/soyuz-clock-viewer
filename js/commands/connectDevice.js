export const connectDevice = (deviceService) => () => {
    deviceService.send('CONNECT');
};

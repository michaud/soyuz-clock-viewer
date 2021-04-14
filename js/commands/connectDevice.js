export const connectDevice = (deviceService) => () => {
    deviceService.send('TOGGLE_CONNECT');
};

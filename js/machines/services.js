export const services = {

    startTick: context => callback => {

        if (context.isConnected) {

            const interval = setInterval(() => {
                callback('TICK');
            }, 1000 * context.interval);

            return () => {
                clearInterval(interval);
            };
        }
    },

    bumpPowerOn: context => callback => context.isPowerOn && callback('POWER_ON')
};

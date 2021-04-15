export const guards = {
    alarmTimeReached: context => {
        return context.clockTime > context.alarmTime;
    }
};

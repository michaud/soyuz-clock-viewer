export const guards = {
    alarmTimeReached: context => {
        return context.elapsed > context.alarmTime;
    } // optional, if the implementation doesn't change
};

const soundTheAlarmActivity = (state) => (context, event) => {

    const soundInterval = setInterval(() => {

        const gainNode = state.ac.createGain();
        gainNode.connect(state.ac.destination);
        const oscillator = state.ac.createOscillator();
        oscillator.connect(gainNode);
        gainNode.gain.value = 100 * 0.0021;
        gainNode.gain.setValueAtTime(1, state.ac.currentTime);

        oscillator.start();

        gainNode.gain.setValueAtTime(gainNode.gain.value, state.ac.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, state.ac.currentTime + 1);

        oscillator.stop(state.ac.currentTime + 200 * 0.001);

    }, 1000);

    return () => { clearInterval(soundInterval) }
};

export const getActivities = (state) => {

    return {
        activities: {
            soundTheAlarm: soundTheAlarmActivity(state)
        }
    }
};

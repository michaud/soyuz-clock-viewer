export const alarmToggleOver = (
    scene,
    _,
    visible,
    container
) => {

    container.style.cursor = visible ? 'pointer' : 'move'; 
};

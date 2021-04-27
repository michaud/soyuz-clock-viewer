export const powerSwitchOver = (
    scene,
    _,
    visible,
    container
) => {

    container.style.cursor = visible ? 'pointer' : 'move'; 
};

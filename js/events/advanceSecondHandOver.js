export const advanceSecondHandOver = (
    scene,
    _,
    visible,
    container
) => {

    container.style.cursor = visible ? 'pointer' : 'move'; 
};

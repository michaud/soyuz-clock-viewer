export const chronoTroggleOver = (
    scene,
    _,
    visible,
    container
) => {
    container.style.cursor = visible ? 'pointer' : 'move'; 
};

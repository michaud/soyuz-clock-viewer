export const initSounds = () => {

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    return audioContext;
}

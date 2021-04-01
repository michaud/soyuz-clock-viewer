import * as THREE from '../three/build/three.module.js';

export const advance_second_handAction = ({ actionName, clips, mixer, command = () => {} }) => {

    const clip = clips.find(clip => clip.name === actionName);

    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce);

    return () => {
        
        if(!action.isRunning()) {
            action.reset();
            action.play();
            command();
        }
    };
};

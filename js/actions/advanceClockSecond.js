import * as THREE from '../../three/build/three.module.js';

export const advance_second_handAction = ({ actionName, clips, mixer, command = () => {} }) => {

    const clip = clips.find(clip => clip.name === actionName);
    const action = mixer.clipAction(clip);

    return () => {

        console.log('advance_second_handAction:')

        if(!action.isRunning()) {
            
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce);
            action.paused = false;
            action.play();
            command();
        }
    }
};

import * as THREE from '../three/build/three.module.js';

export const connector_plugAction = ({ actionName, clips, mixer, command = () => {} }) => {

    const clip = clips.find(clip => clip.name === actionName);
    const action = mixer.clipAction(clip);

    let open = false;

    return () => {

        if(!action.isRunning()) {
            
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce);
            action.setEffectiveTimeScale(open ? -1 : 1);
            action.paused = false;
            action.play();
            command();
            open = !open;
        }
    }
};

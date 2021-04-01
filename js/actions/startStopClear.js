import * as THREE from '../three/build/three.module.js';

export const start_stop_clear_buttonAction = ({ actionName, clips, mixer, command = () => {} }) => {

    const indicator = mixer.getRoot().getObjectByName('reset_start_stop_indicator');
    const action = mixer.clipAction(clips.find(clip => clip.name === actionName));

    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce);

    const fullPos = ((2*Math.PI)/ 360) * 96;
    const halfPos = ((2*Math.PI)/ 360) * 24;

    let position = 0;

    const animateIndicator = () => {

        if(!action.paused) {

            const newRot = action.time > .45
                ? position * (fullPos + halfPos)
                : (position * (fullPos + halfPos)) - fullPos;

            indicator.rotation.set(newRot, 0,0,'XYZ')

            requestAnimationFrame(animateIndicator);
        }
    }

    return () => {
        
        if(!action.isRunning()) {

            position = ++position > 2 ? 0 : position;
            action.reset().play();
            animateIndicator();
            command();
        }
    };
};

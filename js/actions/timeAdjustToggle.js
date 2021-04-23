import { LoopOnce } from '../three/build/three.module.js';

export const time_adjust_toggleAction = ({ actionName, clips, mixer, command = () => {} }) => {

    const clip = clips.find(clip => clip.name === actionName);
    const action = mixer.clipAction(clip);

    let open = false;

    return (isPointerMove) => {

        if(!isPointerMove && !action.isRunning()) {
            
            action.clampWhenFinished = true;
            action.setLoop(LoopOnce);
            action.setEffectiveTimeScale(open ? -1 : 1);
            action.paused = false;
            action.play();
            command();
            open = !open;
        }
    }
};

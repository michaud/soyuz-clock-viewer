import * as THREE from '../three/build/three.module.js';

export const initTools = (clips, mixer) => {

    let open = false;
    const descButton = document.getElementById('desc');
    const openButton = document.getElementById('open-close');

    descButton.onclick = e => {

    };

    openButton.onclick = e => {
        
        const clip = clips.find(clip => clip.name === 'flipped_plateAction');
        
        if(clip) {
            
            let direction = 1;
            if(open) direction = -1;

            const action = mixer.clipAction(clip);
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce);
            action.setEffectiveTimeScale(direction);
            action.paused = false;
            action.play();
            
            open = !open;
        }
    };
};

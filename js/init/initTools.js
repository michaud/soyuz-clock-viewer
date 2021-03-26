import * as THREE from '../three/build/three.module.js';

export const initTools = (clips, mixer) => {

    const descButton = document.getElementById('desc');
    const openButton = document.getElementById('open-close');
    const connectButton = document.getElementById('connect');

    descButton.onclick = e => {

    };

    const handleConnectClick = () => {

        let open = false;

        return _ => {

            const clip = clips.find(clip => clip.name === 'connect_locAction');
            
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

    connectButton.onclick = handleConnectClick();

    const handleOpenClick = () => {

        let open = false;

        return _ => {
        
            const clip = clips.find(clip => clip.name === 'flipped_plate_open_Action');
            
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

    openButton.onclick = handleOpenClick();
}

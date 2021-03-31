import * as THREE from '../three/build/three.module.js';

export const initTools = (clips, mixer, hilites, controls, state) => {

    const openButton = document.getElementById('open-close');
    const connectButton = document.getElementById('connect');
    const resetButton = document.getElementById('reset-camera');
    const showHiliteButton = document.getElementById('show-hilite');
    const toggleHiliteSwitch = document.getElementById('toggle-hilite-switch');

    if(state.showHilite) {

        toggleHiliteSwitch.querySelector('.hilite-switch').classList.add('on');

    } else {

        toggleHiliteSwitch.querySelector('.hilite-switch').classList.remove('on');
    }

    const handleToggleHiliteSwitch = e => {

        const target = e.target;
        target.querySelector('.hilite-switch').classList.toggle('on');
        state.showHilite = !state.showHilite;
    }

    toggleHiliteSwitch.addEventListener('pointerup', handleToggleHiliteSwitch);

    const handleResetCameraClick = _ => controls.reset();

    resetButton.onclick = handleResetCameraClick;

    const handleShowHilite = e => {

        let targets = [];

        return _ => {

            if(targets.length === 0) targets = [...hilites];

            if(targets.length === hilites.length) {

                hilites.forEach((hilite, index) => {

                    setTimeout(() => {

                        hilite.target.visible = true;
                        hilite.domEl.classList.add('hilite');

                        setTimeout(() => {

                            hilite.target.visible = false;
                            hilite.domEl.classList.remove('hilite');
                            targets.pop();

                        }, 500);

                    }, index * 500);
                });
            }
        };
    };

    showHiliteButton.onclick = handleShowHilite();

    const handleConnectClick = _ => {

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

    const handleOpenClick = _ => {

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

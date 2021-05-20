import { LoopOnce } from '../three/build/three.module.js';

export const initTools = (clips, mixer, hilites, controls, state, deviceService) => {

    const openButton = document.getElementById('open-close');
    const backFrontButton = document.getElementById('back-front');
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

    const handleBackFrontClick = _ => {

        let open = false;

        return _ => {


            state.ac = new AudioContext();

            const btn = document.getElementById('back-front');
            btn.textContent = open ? 'backside': 'frontside'
    
            const clip = clips.find(clip => clip.name === 'connect_locAction');

            if(clip) {
                
                let direction = 1;
                if(open) direction = -1;

                const action = mixer.clipAction(clip);
                action.clampWhenFinished = true;
                action.setLoop(LoopOnce);
                action.setEffectiveTimeScale(direction);
                action.paused = false;
                action.play();
                
                open = !open;
            }
        };
    };

    backFrontButton.onclick = handleBackFrontClick();

    const handleOpenClick = _ => {

        let open = false;
        const btn = document.getElementById('open-close');

        return _ => {

            btn.textContent = open ? 'open' : 'close'; 
            const clipFlippedPlate = clips.find(clip => clip.name === 'flipped_plate_open_Action');
            const clipBottomCap = clips.find(clip => clip.name === 'bottom_capAction');
            
            let direction = 1;
            if(open) direction = -1;

            if(clipFlippedPlate) {
                
                const action = mixer.clipAction(clipFlippedPlate);
                action.clampWhenFinished = true;
                action.setLoop(LoopOnce);
                action.setEffectiveTimeScale(direction);
                action.paused = false;
                action.play();
            }

            if(clipBottomCap) {

                const action = mixer.clipAction(clipBottomCap);
                action.clampWhenFinished = true;
                action.setLoop(LoopOnce);
                action.setEffectiveTimeScale(direction);
                action.paused = false;
                action.play();
            }

            open = !open;
        };
    };

    openButton.onclick = handleOpenClick();
}

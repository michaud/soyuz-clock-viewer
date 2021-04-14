import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './three/examples/jsm/loaders/DRACOLoader.js';

import { RoughnessMipmapper } from './three/examples/jsm/utils/RoughnessMipmapper.js';

import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';
import { RGBELoaderCallback } from './init/RGBELoading.js';

import { normalizeMousePostion } from './init/initWindow.js';
import { onWindowResize } from './init/initWindow.js';

import { deviceModel as device } from './model/deviceModel.js';
import { initCommands } from './commands/initCommands.js';

import {
    initScene,
    initPicking,
    initTools,
    initMachine,
    initDevice
} from './init/initialise.js';

import { getHilites, initUpdateHilites } from './init/getHilites.js';
import { updateTime } from './update/updateTime.js';
import { updateAlarm } from './update/updateAlarm.js';

import { updateChrono } from './update/updateChrono.js';

const clips = [];
let updateHilites = () => {}, hilites = [];
let ac;

const state = {
    showHilite: false,
    ac: null
};

const deviceService = initMachine(state);
const commands = initCommands(deviceService);
const container = document.getElementById('scene');
const debugContainer = document.getElementById('debug');

const {
    camera,
    scene,
    renderer,
    raycaster,
    pmremGenerator,
    mixer,
    mouse,
    threeTime,
    controls
} = initScene(container);

init();

render();

animate();

function init() {

    normalizeMousePostion(mouse);

    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('assets/equirectangular/')
        .load(
            'vintage_measuring_lab_1k.hdr',
            RGBELoaderCallback(scene, pmremGenerator)
        );

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/js/libs/draco/' );

    new GLTFLoader()
        .setPath('scene/')
        .setDRACOLoader( dracoLoader )
        .load(
            'SoyuzElectroMechanicalSpaceClock.glb',
        (gltf) => {

            const roughnessMipmapper = new RoughnessMipmapper(renderer);
        
            gltf.scene.traverse(function (child) {
        
                if (child.isMesh) {
        
                    // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                    roughnessMipmapper.generateMipmaps( child.material );
                }
            });
        
            scene.add(gltf.scene);
        
            roughnessMipmapper.dispose();

            gltf.animations.forEach(anim => clips.push(anim));

            initDevice(
                scene,
                mixer,
                clips,
                device,
                commands
            );

            getHilites(scene, hilites, state);

            updateHilites = initUpdateHilites(scene, raycaster, state);
        });

    initTools(clips, mixer, hilites, controls, state);

    initPicking(raycaster, device, scene, container, controls, deviceService);

    window.addEventListener('resize', onWindowResize(camera, renderer, render));
}

function animate() {

    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);

    const delta = threeTime.getDelta();
    
    mixer && mixer.update(delta);

    const newDebugText = JSON.stringify(deviceService.state.context, null, '  ') + '\n' + JSON.stringify(deviceService.state.value, null, '  ');
    debugContainer.textContent = newDebugText;

    if (device) {

        updateTime ({
            device,
            ctx: deviceService.state.context
        });

        updateAlarm ({
            device,
            ctx: deviceService.state.context
        });

        updateChrono({
            device,
            ctx: deviceService.state.context,
            state: deviceService.state.value
        });
    }

    updateHilites(hilites);

    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);
}

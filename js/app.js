import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { RoughnessMipmapper } from './three/examples/jsm/utils/RoughnessMipmapper.js';

import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';
import { RGBELoaderCallback } from './init/RGBELoading.js';
import { getRadFromTime } from './utils.js';

import { normalizeMousePostion } from './init/initWindow.js';
import { onWindowResize } from './init/initWindow.js';

import { devices } from './devices.js';
import { initCommands } from './commands/initCommands.js';

import {
    initScene,
    initPicking,
    initTools,
    initClock,
    initMachine
} from './init/initialise.js';

import { getTopPlate } from './init/getTopPlate.js';
import { getConnector } from './init/getConnector.js';
import { getHilites, initUpdateHilites } from './init/getHilites.js';

const clips = [];
const state = {
    showHilite: false
};

const deviceService = initMachine();

let updateHilites = () => {}, hilites = [];
const commands = initCommands(deviceService);

const {
    container,
    camera,
    scene,
    renderer,
    raycaster,
    pmremGenerator,
    mixer,
    mouse,
    threeTime,
    controls
} = initScene();

init();

render();

animate();

function init() {

    normalizeMousePostion(mouse);

    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('equirectangular/')
        .load('vintage_measuring_lab_1k.hdr', RGBELoaderCallback(scene, pmremGenerator));

    new GLTFLoader()
        .setPath('scene/')
        .load('SoyuzElectroMechanicalSpaceClock.glb',(gltf) => {

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

            getTopPlate(
                scene,
                mixer,
                clips,
                devices,
                commands
            );

            getConnector(
                scene,
                mixer,
                clips,
                devices,
                commands
            );

            getHilites(scene, hilites, state);

            updateHilites = initUpdateHilites(scene, raycaster, state);
        });

    initTools(clips, mixer, hilites, controls, state);
    initPicking(raycaster, devices, scene, container);

    initClock();

    window.addEventListener('resize', onWindowResize(camera, renderer, render));
}

function updateTime (devices, timeVal) {

    let time = 0;

    if(timeVal === undefined) {

        const currentDate = new Date();

        const offs = currentDate.getTimezoneOffset();
        const mill = currentDate.getTime() + (-offs * 60000);
    
        time = mill / 1000;

    } else {

        const currentDate = new Date(timeVal * 1000);
        const mill = currentDate.getTime();
    
        time = mill / 1000;
    }

    devices.clock.hands.forEach(hand => {

        hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
    })
}

function animate() {

    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);

    const delta = threeTime.getDelta();
    
    mixer && mixer.update(delta);

    if (devices) {

        if(deviceService.state.value?.connected?.deviceOn) {

            updateTime (devices, deviceService.state.context.elapsed);
        }
    }

    updateHilites(hilites);

    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);
}

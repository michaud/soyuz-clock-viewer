import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { sceneLoaderCallback } from './init/sceneLoading.js';

import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';
import { RGBELoaderCallback } from './init/RGBELoading.js';
import { getRadFromTime } from './utils.js';

import { normalizeMousePostion } from './normalizeMousePosition.js';
import { devices } from './devices.js';
import { deviceMachineDesc } from './deviceMachine.js';

import {
    initPicking,
    initTools,
    initClock
} from './init/initialise.js';
import { initScene } from './init/initScene.js';

let hilites, hiliteTarget;
const clips = [];

const { Machine, actions:machineActions, interpret } = XState; // global variable: window.XState

const deviceMachine = Machine(deviceMachineDesc);

const deviceService = interpret(deviceMachine).onTransition(state =>
    state//console.log('new state', state.value)
);

deviceService.start();
let deviceState;
deviceState = deviceService.send('CONNECT').value;

const mouse = new THREE.Vector2();
const threeTime = new THREE.Clock();

const toggleOnOffDevice = () => {
    const eventName = deviceState?.connected?.deviceOff ?  'TURN_ON' : 'TURN_OFF';
    deviceState = deviceService.send(eventName).value;
};

const advanceClockSecondHand = () => {
    console.log('advanceClockSecondHand')
};

const connectDevice = () => {
    console.log('connectDevice')

};


const commands = {
    toggle_device_on_off: toggleOnOffDevice,
    advance_second_hand: advanceClockSecondHand,
    connect_device: connectDevice
};

const {
    container,
    camera,
    scene,
    renderer,
    raycaster,
    pmremGenerator,
    mixer
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

    new GLTFLoader().setPath('scene/')
        .load('SoyuzElectroMechanicalSpaceClock.glb', sceneLoaderCallback(
            renderer,
            scene,
            mixer,
            clips,
            devices,
            commands
        ));

    initPicking(raycaster, devices, scene, container);
    initClock();
    initTools(clips, mixer);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function updateClock (currentDate = new Date()) {

    const offs = currentDate.getTimezoneOffset();
    const mill = currentDate.getTime() + (-offs * 60000);

    const time = mill / 1000;

    devices.clock.hands.forEach(hand => {

        hand.rotation.set(0, getRadFromTime(hand.time, time), 0, 'XYZ')
    })
}

function updateHilite () {

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {

        if (hiliteTarget != intersects[0].object && intersects[0].object.name.includes('hit')) {

            if (hiliteTarget) {

                const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

                if (overlay) {

                    overlay.target.material.opacity = hiliteTarget.currOpacity;
                }
            }

            hiliteTarget = intersects[0].object;

            const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

            if (overlay) {

                hiliteTarget.currOpacity = overlay.target.material.opacity;

                overlay.target.material.opacity = 0.8;
            }
        }

    } else {

        if (hiliteTarget) {

            const overlay = hilites.find(hilite => hilite.name === hiliteTarget.name);

            if (overlay) {

                overlay.target.material.opacity = hiliteTarget.currOpacity;
            }
        }

        hiliteTarget = null;
    }
}

function animate() {

    requestAnimationFrame(animate);

    const delta = threeTime.getDelta();
    
    mixer && mixer.update(delta);

    if (devices) {

        if(deviceState?.connected?.deviceOn) {

            updateClock();
        }
    }

    updateHilite();

    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);
}

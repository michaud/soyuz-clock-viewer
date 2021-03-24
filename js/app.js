import * as THREE from '../three/build/three.module.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../three/examples/jsm/utils/RoughnessMipmapper.js';

import { deviceElementDescriptors } from './deviceElementDescriptors.js';
import { hiliteDescriptors } from './hiliteDescriptors.js';
import { getRadFromTime } from './utils.js';

import actions from './actions/index.js';
import { normalizeMousePostion } from './normalizeMousePosition.js';
import { devices } from './devices.js';
import { deviceMachineDesc } from './deviceMachine.js';

import {
    initPicking,
    initTools,
    initClock
} from './init/initialise.js';

let camera, scene, renderer, raycaster;
let hilites, hiliteTarget;
let mixer, clips;

const { Machine, actions:machineActions, interpret } = XState; // global variable: window.XState

const deviceMachine = Machine(deviceMachineDesc);

const deviceService = interpret(deviceMachine).onTransition(state =>
    console.log('new state', state.value)
);

deviceService.start();
let deviceState;
deviceState = deviceService.send('CONNECT').value;

const mouse = new THREE.Vector2();
const threeTime = new THREE.Clock();

init();

render();

animate();

function init() {

    normalizeMousePostion(mouse);

    const container = document.getElementById('scene');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 20);
    camera.position.set(0, .2, 0);

    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();

    const sceneLoaderCallback = (gltf) => {

        const roughnessMipmapper = new RoughnessMipmapper(renderer);

        gltf.scene.traverse(function (child) {

            if (child.isMesh) {

                // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                roughnessMipmapper.generateMipmaps( child.material );
            }

        });

        scene.add(gltf.scene);

        roughnessMipmapper.dispose();

        mixer = new THREE.AnimationMixer(scene);
        clips = gltf.animations;

        const rootScene = scene.children[0];

        const flippedPlate = rootScene.children.find(child => child.name === 'flipped_plate');

        const toggleOnOffDevice = () => {
            const eventName = deviceState?.connected?.deviceOff ?  'TURN_ON' : 'TURN_OFF';
            deviceState = deviceService.send(eventName).value;
        };

        const advanceClockSecondHand = () => {
            console.log('advanceClockSecondHand')
        };

        const commands = {
            toggle_device_on_off: toggleOnOffDevice,
            advance_second_hand: advanceClockSecondHand
        };

        deviceElementDescriptors.forEach(item => {

            const found = flippedPlate.children.find(child => {

                return child.name === item.name;
            });

            if (found) {

                devices[item.device][item.type].push({
                    ...found,
                    ...item,
                    action: item.action && actions[item.action]({
                        actionName: item.action,
                        clips,
                        mixer,
                        command: commands[item.command]
                    })
                });
            }
        });

        //console.log('devices:', devices)
        hilites = [];

        hiliteDescriptors.forEach(item => {

            const hitFound = gltf.scene.children.find(child => child.name === item.name);
            const overlayFound = gltf.scene.children.find(child => child.name === item.target);

            if (hitFound && overlayFound) {

                hilites.push({
                    ...item,
                    hit: hitFound,
                    target: overlayFound
                })
            }
        });

        initTools(clips, mixer);
    }

    const RGBELoaderCallback = (texture) => {

        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        // use of RoughnessMipmapper is optional
        
        const loader = new GLTFLoader().setPath('scene/');

        loader.load('SoyuzElectroMechanicalSpaceClock.glb', sceneLoaderCallback);
    };

    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('equirectangular/')
        .load('vintage_measuring_lab_1k.hdr', RGBELoaderCallback);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = .1;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    initPicking(raycaster, devices, scene, container);
    initClock();

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

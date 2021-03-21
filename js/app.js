import * as THREE from '../three/build/three.module.js';

import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../three/examples/jsm/utils/RoughnessMipmapper.js';

import { deviceElementDescriptors } from './deviceElementDescriptors.js';
import { hiliteDescriptors } from './hiliteDescriptors.js';

import { getRadFromTime } from './utils.js';

import actions from './actions/index.js';

let camera, scene, renderer, raycaster;
let devices, hilites, hiliteTarget;
let deviceOn = true;
let mixer, clips;
let open = false;

const mouse = new THREE.Vector2();
const clock = new THREE.Clock();

init();

render();

animate();

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

window.addEventListener('mousemove', onMouseMove, false);

function initTools () {

    const descButton = document.getElementById('desc');
    const openButton = document.getElementById('open-close');

    descButton.onclick = e => {

    };

    openButton.onclick = e => {

        let direction = 1;
        if(open) direction = -1;

        // Play all animations
        clips && clips.forEach(function (clip) {

            const action = mixer.clipAction(clip);
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce);
            action.setEffectiveTimeScale(direction);
            action.paused = false;
            action.play();
        });

        open = !open;
    };
}

function init() {

    const container = document.getElementById('scene');

    initTools();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 20);
    camera.position.set(0, .2, 0);

    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();

    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('equirectangular/')
        .load('vintage_measuring_lab_1k.hdr', function (texture) {

            const envMap = pmremGenerator.fromEquirectangular(texture).texture;

            scene.background = envMap;
            scene.environment = envMap;

            texture.dispose();
            pmremGenerator.dispose();

            // use of RoughnessMipmapper is optional
            const roughnessMipmapper = new RoughnessMipmapper(renderer);

            const loader = new GLTFLoader().setPath('scene/');
            loader.load('SoyuzElectroMechanicalSpaceClock_012.glb', function (gltf) {

                gltf.scene.traverse(function (child) {

                    if (child.isMesh) {

                        // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                        // roughnessMipmapper.generateMipmaps( child.material );

                    }

                });

                scene.add(gltf.scene);

                roughnessMipmapper.dispose();

                devices = {
                    device: {
                        buttons: []
                    },
                    chronometer: {
                        hands: [],
                        buttons: []
                    },
                    clock: {
                        hands: [],
                        buttons: []
                    },
                    alarm: {
                        hands: [],
                        buttons: []
                    },
                    mission_timer: {
                        hands: [],
                        buttons: []
                    }
                };

                mixer = new THREE.AnimationMixer(gltf.scene);
                clips = gltf.animations;
                console.log('clips:', clips)

                const flippedPlate = gltf.scene.children.find(child => child.name === 'flipped_plate');

                const toggleOnOffDevice = () => {
                    deviceOn = !deviceOn;
                };

                const commands = {
                    toggle_device_on_off: toggleOnOffDevice
                };

                deviceElementDescriptors.forEach(item => {

                    const found = flippedPlate.children.find(child => child.name === item.name);

                    if (found) {

                        devices[item.device][item.type].push({
                            ...found,
                            ...item,
                            action: item.action && actions[item.action](item.action, clips, mixer, commands[item.command])
                        });
                    }
                });

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
            });
        });


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

    function myMouseUp () {

        const intersects = raycaster.intersectObjects(scene.children, true);
    
        if (intersects.length > 0) {

            let button;

            for(let device in devices) {

                const test = devices[device].buttons && devices[device].buttons.find(button => {

                    return button.name === intersects[0].object.name;
                });

                if(test) button = test;
            }

            if(button) button.action()
        }
    }
    
    container.addEventListener('pointerup', myMouseUp);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}


function animate() {

    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    
    mixer && mixer.update(delta);

    const mydate = new Date();
    const offs = mydate.getTimezoneOffset()
    const mill = mydate.getTime() + (-offs * 60000);

    const time = mill / 1000;

    if (devices) {

        if(deviceOn) {
            devices.clock.hands.forEach(hand => {

                hand.rotation.set(0, getRadFromTime(hand.time, time) * -1, 0, 'XYZ')
            })
        }
    }

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

    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);
}

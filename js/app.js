import {
    LoadingManager,
    UnsignedByteType
} from './three/build/three.module.js';

import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './three/examples/jsm/loaders/DRACOLoader.js';

import { RoughnessMipmapper } from './three/examples/jsm/utils/RoughnessMipmapper.js';

import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';
import { RGBELoaderCallback } from './init/RGBELoading.js';

import { normalizeMousePostion } from './init/initWindow.js';
import { onWindowResize } from './init/initWindow.js';

import { deviceModel as device } from './model/deviceModel.js';
import { initCommands } from './commands/initCommands.js';

import { loadingPanel } from './components/loadPanel.js';

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
import { updateMissionTime } from './update/updateMissionTime.js';

const clips = [];
let updateHilites = () => { }, hilites = [];

const state = {
    showHilite: false,
    ac: null
};

const deviceService = initMachine(state, device);
const commands = initCommands(deviceService);
const container = document.getElementById('scene');
const minuteHand = document.getElementById('minuteHand');
const hourHand = document.getElementById('hourHand');
const loader = document.getElementById('loader');

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

    const loadingDisplay = loadingPanel(loader, minuteHand, hourHand);

    normalizeMousePostion(mouse);

    const rgbeLoadManager = new LoadingManager();
    rgbeLoadManager.onStart = function (url, itemsLoaded, itemsTotal) {

        loadingDisplay.addLoader({ url, loaded: 0, total: 1632977 })
    };

    const gltfLoadmanager = new LoadingManager();
    gltfLoadmanager.onStart = function (url, itemsLoaded, itemsTotal) {

        loadingDisplay.addLoader({ url, loaded: 0, total: 2753452 })
    };

    const RGBELoad = new RGBELoader(rgbeLoadManager)
        .setDataType(UnsignedByteType)
        .setPath('assets/equirectangular/')

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('js/three/examples/js/libs/draco/');

    loadingDisplay.show();

    const GLTFLoad = new GLTFLoader(gltfLoadmanager)
        .setPath('scene/')
        .setDRACOLoader(dracoLoader);

    RGBELoad.load(
        'vintage_measuring_lab_1k.hdr',
        RGBELoaderCallback(scene, pmremGenerator),
        xhr => loadingDisplay.updateLoaded({
            url: 'assets/equirectangular/vintage_measuring_lab_1k.hdr',
            loaded: xhr.loaded
        })
    );

    GLTFLoad.load(
        'SoyuzElectroMechanicalSpaceClock.glb',
        (gltf) => {

            const roughnessMipmapper = new RoughnessMipmapper(renderer);

            gltf.scene.traverse(function (child) {

                if (child.isMesh) {

                    // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                    roughnessMipmapper.generateMipmaps(child.material);
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
        },
        xhr => loadingDisplay.updateLoaded({
            url: 'SoyuzElectroMechanicalSpaceClock.glb',
            loaded: xhr.loaded
        }),
        function (error) {

            console.log('An error happened');

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

    if (device) {

        updateTime({
            device,
            ctx: deviceService.state.context
        });

        updateAlarm({
            device,
            ctx: deviceService.state.context
        });

        updateChrono({
            device,
            ctx: deviceService.state.context,
            state: deviceService.state.value
        });

        updateMissionTime({
            device,
            ctx: deviceService.state.context,
        })
    }

    updateHilites(hilites);

    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);
}

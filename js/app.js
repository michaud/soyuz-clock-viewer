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
    showHilite: true,
    ac: null
};

const deviceService = initMachine(state, device);
const commands = initCommands(deviceService);
const container = document.getElementById('scene');

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

    const loaderStatus = document.getElementById('loader-container');
    const intro = document.getElementById('intro');
    const stepAside = document.getElementById('step-aside');
    const loadingDisplay = loadingPanel();

    stepAside.onclick = () => {
        intro.classList.remove('open');
    }
    normalizeMousePostion(mouse);

    const rgbeLoadManager = new LoadingManager();
    rgbeLoadManager.onStart = url => loadingDisplay.addLoader({
        url,
        loaded: 0,
        staticTotal: 1632977
    });

    const gltfLoadmanager = new LoadingManager();
    gltfLoadmanager.onStart = url => loadingDisplay.addLoader({
        url,
        loaded: 0,
        staticTotal: 2759336
    })

    const RGBELoad = new RGBELoader(rgbeLoadManager)
        .setDataType(UnsignedByteType)
        .setPath('assets/equirectangular/')

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('js/three/examples/js/libs/draco/');

    
    const GLTFLoad = new GLTFLoader(gltfLoadmanager)
        .setPath('scene/')
        .setDRACOLoader(dracoLoader);

    loadingDisplay.show();

    RGBELoad.load(
        'vintage_measuring_lab_1k.hdr',
        RGBELoaderCallback(scene, pmremGenerator),
        xhr => loadingDisplay.updateLoaded({
            url: 'assets/equirectangular/vintage_measuring_lab_1k.hdr',
            loaded: xhr.loaded,
            total: xhr.total
        }),
        error => console.log('An error happened', error)
    );

    GLTFLoad.load(
        'SoyuzElectroMechanicalSpaceClock.glb',
        gltf => {

            const roughnessMipmapper = new RoughnessMipmapper(renderer);

            gltf.scene.traverse(function (obj) {

                if (obj.isMesh) {
                    console.log('parent:', obj.parent.name, 'obj:', obj.name)

                    // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                    roughnessMipmapper.generateMipmaps(obj.material);

                    if(obj.parent.name === 'inner_works_anchor') {

                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }

                    if(obj.name === 'flipped_plate') {

                        obj.receiveShadow = true;
                    }
                }
                
                if (obj.isLight) {

                    obj.castShadow = true;
                    obj.receiveShadow = true;

                    obj.shadow.camera.near = 0.001;
                    obj.shadow.camera.updateProjectionMatrix();
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

            loaderStatus.style.display = 'none';
            intro.classList.add('open');
        },
        xhr => {

            loadingDisplay.updateLoaded({
            url: 'SoyuzElectroMechanicalSpaceClock.glb',
            loaded: xhr.loaded,
            total: xhr.total
        })},
        error => {
            
            console.log('An error happened', error);

        }
    );

    initTools(clips, mixer, hilites, controls, state, deviceService);

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

    controls.update();
    renderer.render(scene, camera);
}

function render() {

    renderer.render(scene, camera);
}

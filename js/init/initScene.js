import * as THREE from '../three/build/three.module.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';

export const initScene = (container) => {

    const mouse = new THREE.Vector2();
    const scene = new THREE.Scene();
    const raycaster = new THREE.Raycaster();
    const threeTime = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 20);
    camera.position.set(0, .199, .1);

    const mixer = new THREE.AnimationMixer(scene);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.minDistance = .1;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    return {
        camera,
        scene,
        renderer,
        raycaster,
        pmremGenerator,
        mixer,
        mouse,
        threeTime,
        controls
    }
};

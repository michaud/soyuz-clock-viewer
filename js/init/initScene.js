import {
    Vector2,
    Scene,
    Raycaster,
    Clock,
    PerspectiveCamera,
    AnimationMixer,
    WebGLRenderer,
    ACESFilmicToneMapping,
    PMREMGenerator,
    sRGBEncoding
} from '../three/build/three.module.js';

import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';

export const initScene = container => {

    const mouse = new Vector2();
    const scene = new Scene();
    const raycaster = new Raycaster();
    const threeTime = new Clock();

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 20);
    camera.position.set(0, .2, 0);

    const mixer = new AnimationMixer(scene);

    const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new PMREMGenerator(renderer);
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

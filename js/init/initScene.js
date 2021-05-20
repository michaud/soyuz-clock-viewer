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
    sRGBEncoding,
    PCFShadowMap,
    DirectionalLight
} from '../three/build/three.module.js';

import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';

export const initScene = container => {

    const mouse = new Vector2();
    const scene = new Scene();
    const raycaster = new Raycaster();
    const threeTime = new Clock();

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 20);
    camera.position.set(0, .175, .065);
    //camera.position.set(0, .2, 0);

    const mixer = new AnimationMixer(scene);

    const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
    });

    // let directionalLight = new DirectionalLight( 0xffffff, 0.7, 18 );
    // directionalLight.position.set(0, 0, 1);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.camera.left = - 3;
    // directionalLight.shadow.camera.right = 3;
    // directionalLight.shadow.camera.top = 3;
    // directionalLight.shadow.camera.bottom = - 3;
    // directionalLight.shadow.camera.fov = 45;
    // directionalLight.shadow.camera.aspect = 1;
    // directionalLight.shadow.camera.near = 0.1;
    // directionalLight.shadow.camera.far = 3;
    // directionalLight.shadow.bias = 0.001;
    // directionalLight.shadow.normalBias = 0.003;
    // directionalLight.shadow.mapSize.width = 2048;
    // directionalLight.shadow.mapSize.height = 2048;
    
    // scene.add( directionalLight );

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = .75;
    renderer.outputEncoding = sRGBEncoding;
    renderer.physicallyCorrectLights = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = true;
    renderer.receiveShadow = true;
    //renderer.gammaFactor = 2.2;
    renderer.shadowMap.type = PCFShadowMap;

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

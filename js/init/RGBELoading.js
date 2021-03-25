export const RGBELoaderCallback = (scene, pmremGenerator) => (texture) => {

    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.background = envMap;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();
};

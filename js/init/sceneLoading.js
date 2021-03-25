import { RoughnessMipmapper } from '../../three/examples/jsm/utils/RoughnessMipmapper.js';

import { deviceElementDescriptors } from '../deviceElementDescriptors.js';
import actions from '../actions/index.js';

export const sceneLoaderCallback = (renderer, scene, mixer, clips, devices, commands) => (gltf) => {

    console.log('sceneLoaderCallback')
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

    const rootScene = scene.children[0];

    const flippedPlate = rootScene.children.find(child => child.name === 'flipped_plate');

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
};

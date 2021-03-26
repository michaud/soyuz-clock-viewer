import { RoughnessMipmapper } from '../three/examples/jsm/utils/RoughnessMipmapper.js';

import { deviceElementDescriptors } from '../deviceElementDescriptors.js';
import actions from '../actions/index.js';

export const sceneLoaderCallback = (renderer, scene, mixer, clips, devices, commands) => (gltf) => {

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

    const flippedPlate = scene.children[0].children[0].children[1];

    deviceElementDescriptors.forEach(item => {

        if(item.name === 'connector_plug') {

            const plug = scene.children[0].children[0].children[0].children[0];
            devices[item.device][item.type].push({
                ...plug,
                ...item,
                action: item.action && actions[item.action]({
                    actionName: item.action,
                    clips,
                    mixer,
                    command: commands[item.command]
                })
            });            
        }

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

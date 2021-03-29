import { deviceElementDescriptors } from '../descriptors/deviceElementDescriptors.js';
import actions from '../actions/index.js';

export const getTopPlate = (
    scene,
    mixer,
    clips,
    devices,
    commands
) => {

    const flippedPlate = scene.children[0].children[0].children[1];

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

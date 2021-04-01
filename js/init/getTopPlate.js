import { deviceElementDescriptors } from '../descriptors/deviceElementDescriptors.js';
import actions from '../actions/index.js';

export const getTopPlate = (
    scene,
    mixer,
    clips,
    devices,
    commands
) => deviceElementDescriptors.forEach(item => {

    const found = scene.getObjectByName(item.name);

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

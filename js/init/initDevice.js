import { devicePartDescriptors } from '../descriptors/devicePartDescriptors.js';
import actions from '../actions/index.js';

export const initDevice = (
    scene,
    mixer,
    clips,
    devices,
    commands
) => devicePartDescriptors.forEach(item => {

    const found = scene.getObjectByName(item.name);

    if (found) {

        const deviceFound = {
            ...found,
            ...item,
            action: item.action && actions[item.action]({
                actionName: item.action,
                clips,
                mixer,
                command: commands[item.command]
            })
        };

        devices[item.device][item.type].push(deviceFound);
    }
});

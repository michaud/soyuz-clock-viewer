import { deviceElementDescriptors } from '../descriptors/deviceElementDescriptors.js';
import actions from '../actions/index.js';

export const getConnector = (
    scene,
    mixer,
    clips,
    devices,
    commands
) => {
    
    const found = scene.getObjectByName('connector_plug');
    
    const descriptor = deviceElementDescriptors.find(item => item.name === found.name)

    if (found) {

        devices[descriptor.device][descriptor.type].push({
            ...found,
            ...descriptor,
            action: descriptor.action && actions[descriptor.action]({
                actionName: descriptor.action,
                clips,
                mixer,
                command: commands[descriptor.command]
            })
        });
    }
};
;

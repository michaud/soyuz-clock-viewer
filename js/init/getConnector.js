import { deviceElementDescriptors } from '../descriptors/deviceElementDescriptors.js';
import actions from '../actions/index.js';

export const getConnector = (
    scene,
    mixer,
    clips,
    devices,
    commands
) => {

    const found = scene.children[0].children[0].children[0].children[0];
    const descriptor = deviceElementDescriptors.find(item => item.name === 'connector_plug')

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

import { devicePartDescriptors } from '../descriptors/devicePartDescriptors.js';
import actions from '../actions/index.js';

export const initDevice = (
    scene,
    mixer,
    clips,
    device,
    commands
) => devicePartDescriptors.forEach(item => {

    const partFromScene = scene.getObjectByName(item.name);

    if (partFromScene) {

        const part = {
            ...partFromScene,
            ...item,
            action: item.action && actions[item.action]({
                actionName: item.action,
                clips,
                mixer,
                command: commands[item.command]
            }),
        };

        if(item.type === 'buttons') device[item.type][item.name] = part;

        device[item.component][item.type].push(part);
    }
});

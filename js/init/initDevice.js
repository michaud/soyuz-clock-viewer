import { devicePartDescriptors } from '../descriptors/devicePartDescriptors.js';
import actions from '../actions/index.js';
import events from '../events/index.js';

export const initDevice = (
    scene,
    mixer,
    clips,
    device,
    commands
) => devicePartDescriptors.forEach(item => {

    const partFromScene = scene.getObjectByName(item.name);

    if (partFromScene) {

        const action = item.action ? { action: actions[item.action]({
            actionName: item.action,
            clips,
            mixer,
            command: commands[item.command]
        }) } : {};

        const move = item.move ? { move: events.moves[item.move] } : {};
        const up = item.up ? { pointerUp: events.ups[item.up] } : {};
        const over = item.over ? { pointerOver: events.overs[item.over] } : {};

        const part = {
            ...partFromScene,
            ...item,
            ...action,
            ...move,
            ...up,
            ...over
        };

        if(item.type === 'buttons') device[item.type][item.name] = part;

        device[item.component][item.type].push(part);
    }
});

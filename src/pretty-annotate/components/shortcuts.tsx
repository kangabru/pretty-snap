import { Fragment, h } from 'preact';

export default function Shortcuts() {
    return <div class="overflow-x-auto">
        <table class="max-w-full mx-auto overflow-x-auto">
            <thead>
                <td class="px-2 font-semibold">Shortcut</td>
                <td class="px-2 font-semibold">Description</td>
                <td class="px-2 font-semibold">Shapes</td>
            </thead>
            <tbody class="space-y-2 divide-y">
                <Row
                    command={<><Command text="DRAG" /> + <Shift /></>}
                    description="Fix aspect ratio"
                    info={<><Shape text="Box" /> <Shape text="Ellipse" /></>} />
                <Row
                    command={<><Command text="DRAG" /> + <Shift /></>}
                    description="Snap to 45° lines"
                    info={<><Shape text="Line" /> <Shape text="Arrow" /> <Shape text="Bracket" /></>} />
                <Row
                    command={<><Command text="DRAG" /> + <Alt /></>}
                    description="Flip bracket direction"
                    info={<Shape text="Bracket" />} />
                <Row
                    command={<><Ctrl /> + <Command text="Z" /></>}
                    description="Undo"
                    info="-" />
                <Row
                    command={<><Ctrl /> + <Command text="Y" /></>}
                    description="Redo"
                    info="-" />
                <Row
                    command={<><Ctrl /> + <Shift /> + <Command text="Z" /></>}
                    description="Redo"
                    info="-" />
            </tbody>
        </table>
    </div>
}

function Row({ command, description, info }: { command: any, description: any, info: any }) {
    return <tr>
        <td class="p-2 whitespace-nowrap">{command}</td>
        <td class="p-2 whitespace-nowrap">{description}</td>
        <td class="p-2 whitespace-nowrap">{info}</td>
    </tr>
}

const Shift = () => <Command text="SHIFT" />
const Ctrl = () => <Command text="CTRL" />
const Alt = () => <Command text="ALT" />

function Command({ text }: { text: string }) {
    return <span class="py-0.5 px-1 bg-blue-200 rounded text-sm uppercase">{text}</span>
}

function Shape({ text }: { text: string }) {
    return <span class="py-0.5 px-1 bg-orange-200 rounded text-sm">{text}</span>
}
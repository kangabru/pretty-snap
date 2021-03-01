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

                {/* Drag + Shift */}
                <Row rowSpan1={2}
                    col1={<><Command text="DRAG" /> + <Shift /></>}
                    col2="Fix aspect ratio"
                    col3={<><Shape text="Box" /> <Shape text="Ellipse" /></>} />
                <Row
                    col2="Snap to 45° lines"
                    col3={<><Shape text="Line" /> <Shape text="Arrow" /> <Shape text="Bracket" /></>} />

                {/* Drag + Alt */}
                <Row rowSpan1={2}
                    col1={<><Command text="DRAG" /> + <Alt /></>}
                    col2="Flip bracket direction"
                    col3={<Shape text="Bracket" />} />
                <Row
                    col2="Draw inside bounds"
                    col3={<Shape text="Ellipse" />} />

                {/* Undo */}
                <Row
                    col1={<><Ctrl /> + <Command text="Z" /></>}
                    col2={<p class="text-center">Undo</p>} />

                {/* Redo */}
                <Row
                    col1={<><Ctrl /> + <Command text="Y" /></>}
                    col2={<p class="text-center">Redo</p>} rowSpan2={2} />
                <Row
                    col1={<><Ctrl /> + <Shift /> + <Command text="Z" /></>} />
            </tbody>
        </table>
    </div>
}

type Cols = { col1?: any, col2?: any, col3?: any }
type RowSpans = { rowSpan1?: number, rowSpan2?: number, rowSpan3?: number }

function Row({ col1, col2, col3, rowSpan1, rowSpan2, rowSpan3 }: Cols & RowSpans) {
    return <tr>
        {col1 && <td rowSpan={rowSpan1 ?? 1} class="p-2 whitespace-nowrap">{col1}</td>}
        {col2 && <td rowSpan={rowSpan2 ?? 1} class="p-2 whitespace-nowrap">{col2}</td>
        {col3 && <td rowSpan={rowSpan3 ?? 1} class="p-2 whitespace-nowrap">{col3}</td>
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
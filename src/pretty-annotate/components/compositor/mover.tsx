import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { ChildrenWithProps } from '../../../common/misc/types';
import { Bounds } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { MovePane, onResizeEvents, RenderProps } from './move-pane';

/** TODO */
export default function Mover() {
    const idEditing = useAnnotateStore(s => s.idEditing)
    const a = useAnnotateStore(useCallback(s => idEditing ? s.index[idEditing] : undefined, [idEditing]))
    return a ? <MovePane initBounds={a as any}>
        {props => <MoveUi {...props}>
            {bounds => <GenericAnnotation {...a} {...bounds} />}
        </MoveUi>}
    </MovePane> : null
}

function MoveUi({ bounds, onDrag, onResize, children }: RenderProps & ChildrenWithProps<Bounds>) {
    const { left, top, width, height } = bounds
    return <div class="absolute inset-0" onMouseMove={onDrag.move} onMouseUp={onDrag.stop} onMouseLeave={onDrag.stop}>
        {children(bounds)}
        <div style={{ left, top, width, height }} class="absolute bg-black bg-opacity-20" onMouseDown={onDrag.start} />
        <ResizeUi {...bounds} {...onResize} />
    </div>
}

function ResizeUi({ start, move, stop, ...bounds }: Bounds & onResizeEvents) {
    const l = bounds.left, t = bounds.top
    const r = bounds.left + bounds.width, b = bounds.top + bounds.height
    const mx = (l + r) / 2, my = (t + b) / 2

    function Point(ps: { style: any, top?: boolean, right?: boolean, bottom?: boolean, left?: boolean }) {
        return <div style={ps.style} class="absolute bg-white w-4 h-4 -ml-2 -mt-2 rounded-full shadow"
            onMouseDown={e => start(ps.top, ps.right, ps.bottom, ps.left)(e)}></div>
    }

    return <>
        <Point style={{ left: l, top: t, cursor: "nwse-resize" }} top left />
        <Point style={{ left: r, top: t, cursor: "nesw-resize" }} top right />
        <Point style={{ left: l, top: b, cursor: "nesw-resize" }} bottom left />
        <Point style={{ left: r, top: b, cursor: "nwse-resize" }} bottom right />

        <Point style={{ left: mx, top: t, cursor: "ns-resize" }} top />
        <Point style={{ left: r, top: my, cursor: "ew-resize" }} right />
        <Point style={{ left: mx, top: b, cursor: "ns-resize" }} bottom />
        <Point style={{ left: l, top: my, cursor: "ew-resize" }} left />
    </>
}

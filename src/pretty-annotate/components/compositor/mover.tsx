import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { ChildrenWithProps } from '../../../common/misc/types';
import { AnnotationAny, Bounds } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation, { GenericSelectableArea } from '../annotations';
import { onResizeEvents, useMove } from './move-pane';

export type MovePaneProps = {
    initBounds: Bounds,
    close: () => void,
    onSave: (_: Bounds) => void,
}

/** TODO */
export default function Mover() {

    const editId = useAnnotateStore(s => s.editId)
    const editStop = useAnnotateStore(s => s.editStop)

    const annotation = useAnnotateStore(useCallback(s => s.index[editId as string], [editId]))
    const save = (bounds: Bounds) => annotation && useAnnotateStore.getState().save({ ...annotation, ...bounds })

    return annotation
        ? <MoveUi key={editId} initBounds={annotation as any} close={editStop} onSave={save}>
            {bounds => <>
                <SelectableAreas />
                <GenericAnnotation {...annotation} {...bounds} />
            </>}
        </MoveUi>
        : <SelectableAreas />
}

function SelectableAreas() {
    const ids = useAnnotateStore(s => s.ids)
    return <>{ids.map(id => <SelectableArea key={id} id={id} />)}</>
}


function SelectableArea({ id }: { id: string }) {
    const annotation = useAnnotateStore(s => s.index[id] as AnnotationAny)
    return <GenericSelectableArea {...annotation as Bounds} shape={annotation.shape} onClick={e => {
        useAnnotateStore.getState().edit(id)
        e.stopPropagation()
    }} />
}

function MoveUi({ onSave, close, initBounds, children }: ChildrenWithProps<Bounds> & {
    initBounds: Bounds, close: () => void, onSave: (_: Bounds) => void
}) {
    const [bounds, onDrag, onResize] = useMove(initBounds, onSave)
    const { left, top, width, height } = bounds
    return <div class="absolute inset-0" onClick={close}
        onMouseMove={onDrag.move} onMouseUp={onDrag.stop} onMouseLeave={onDrag.stop}>
        {children(bounds)}
        <div style={{ left, top, width, height }} class="absolute bg-black bg-opacity-20 cursor-move"
            onMouseDown={onDrag.start} onClick={e => e.stopPropagation()} />
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

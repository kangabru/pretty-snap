import { Fragment, h } from 'preact';
import { ChildrenWithProps } from '../../../common/misc/types';
import useEditingAnnotation from '../../hooks/use-annotation';
import { AnnotationAny, Bounds, Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation, { GenericSelectableArea, GetResizeUiConfig } from '../annotations';
import { onResizeEvents, useMove } from './move-pane';

export type MovePaneProps = {
    initBounds: Bounds,
    close: () => void,
    onSave: (_: Bounds) => void,
}

/** TODO */
export default function Mover() {

    const [editId, annotation] = useEditingAnnotation()
    const editStop = useAnnotateStore(s => s.editStop)
    const save = (bounds: Bounds) => annotation && useAnnotateStore.getState().save({ ...annotation, ...bounds })

    return annotation
        ? <MoveUi key={editId} close={editStop} onSave={save}
            initBounds={annotation as Bounds} shape={annotation.shape}>
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
    return <GenericSelectableArea bounds={annotation as Bounds} shape={annotation.shape}
        class="cursor-pointer" onClick={e => {
            useAnnotateStore.getState().edit(id)
            e.stopPropagation()
        }} />
}

function MoveUi({ onSave, close, initBounds, shape, children }: ChildrenWithProps<Bounds> & {
    initBounds: Bounds, close: () => void, onSave: (_: Bounds) => void, shape: Shape,
}) {
    const [bounds, onDrag, onResize] = useMove(initBounds, onSave)
    return <div class="absolute inset-0" onClick={close}
        onMouseMove={onDrag.move} onMouseUp={onDrag.stop} onMouseLeave={onDrag.stop}>
        {children(bounds)}
        <GenericSelectableArea bounds={bounds} shape={shape} class="cursor-move"
            onMouseDown={onDrag.start} onClick={e => e.stopPropagation()} />
        <ResizeUi {...bounds} {...onResize} shape={shape} />
    </div>
}

export type ResizeConfig = {
    top?: boolean, left?: boolean,
    right?: boolean, bottom?: boolean,
    topLeft?: boolean, topRight?: boolean,
    bottomLeft?: boolean, bottomRight?: boolean,
}

function ResizeUi({ start, move, stop, shape, ...bounds }: Bounds & onResizeEvents & { shape: Shape }) {
    const _l = bounds.left, _t = bounds.top
    const _r = bounds.left + bounds.width
    const _b = bounds.top + bounds.height

    const negX = bounds.width < 0
    const negY = bounds.height < 0

    const l = Math.min(_l, _r), t = Math.min(_t, _b)
    const r = Math.max(_l, _r), b = Math.max(_t, _b)

    const mx = (l + r) / 2, my = (t + b) / 2

    function Point(ps: { style: any, top?: boolean, right?: boolean, bottom?: boolean, left?: boolean }) {
        const left = negX ? ps.right : ps.left, right = negX ? ps.left : ps.right
        const top = negY ? ps.bottom : ps.top, bottom = negY ? ps.top : ps.bottom
        return <div style={ps.style} class="absolute bg-white border-t border-gray-300 w-4 h-4 -ml-2 -mt-2 rounded-full shadow"
            onMouseDown={e => start(top, right, bottom, left)(e)}></div>
    }

    const config = GetResizeUiConfig(shape, bounds)

    return <>
        {config?.topLeft && <Point style={{ left: l, top: t, cursor: "nwse-resize" }} top left />}
        {config?.topRight && <Point style={{ left: r, top: t, cursor: "nesw-resize" }} top right />}
        {config?.bottomLeft && <Point style={{ left: l, top: b, cursor: "nesw-resize" }} bottom left />}
        {config?.bottomRight && <Point style={{ left: r, top: b, cursor: "nwse-resize" }} bottom right />}

        {config?.top && <Point style={{ left: mx, top: t, cursor: "ns-resize" }} top />}
        {config?.right && <Point style={{ left: r, top: my, cursor: "ew-resize" }} right />}
        {config?.bottom && <Point style={{ left: mx, top: b, cursor: "ns-resize" }} bottom />}
        {config?.left && <Point style={{ left: l, top: my, cursor: "ew-resize" }} left />}
    </>
}

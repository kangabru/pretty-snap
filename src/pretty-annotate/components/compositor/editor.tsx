import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { ChildrenWithProps } from '../../../common/misc/types';
import useEditingAnnotation from '../../hooks/use-annotation';
import { onResizeStart, useMove } from '../../hooks/use-move';
import { AnnotationAny, Bounds, Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation, { GenericSelectableArea, GetResizeUiConfig } from '../annotations';
import { editAnnotation } from '../annotations/util';

/** This component allows a user to click drawn elements to start editing them.
 * The selected component can then be moved, edited, and resized depending on its shape.
 *
 * The edit process works as follows:
 * - We render 'selectable areas' which are invisible elements that surround an annotation.
 *   They 'select' an annotation for editing when clicked on.
 * - Once an annotation is selected we render a 'move UI' above everything that allows for
 *   annotations to be resize/moved etc. The UI is specific to the selected shape.
 */
export default function Editor() {

    const [editId, annotation] = useEditingAnnotation()
    const editStop = useAnnotateStore(s => s.editStop)
    const save = (bounds: Bounds) => annotation && useAnnotateStore.getState().save({ ...annotation, ...bounds })

    // Render the 'move UI' or the 'selectable areas' depending on if we're editing an annoation
    return annotation
        ? <MoveUi key={editId} close={editStop} onSave={save} annotation={annotation}>
            {bounds => <>
                <SelectableAreas />
                <GenericAnnotation {...annotation} {...bounds} />
            </>}
        </MoveUi>
        : <SelectableAreas />
}

/** Renders all selectable areas */
function SelectableAreas() {
    const ids = useAnnotateStore(s => s.ids)
    return <>{ids.map(id => <SelectableArea key={id} id={id} />)}</>
}

/** Renders the shape-specific selectable area. */
function SelectableArea({ id }: { id: string }) {
    const annotation = useAnnotateStore(useCallback(s => s.index[id], [id])) as AnnotationAny
    return <GenericSelectableArea class="cursor-pointer" annotation={annotation}
        events={{
            onClick: e => {
                editAnnotation(id)
                e.stopPropagation()
            }
        }} />
}

/** Renders a shape-specific UI that allows the user to move/resize/edit the annotation. */
function MoveUi({ onSave, close, annotation, children }:
    ChildrenWithProps<Bounds> & {
        annotation: AnnotationAny,
        close: () => void, onSave: (_: Bounds) => void,
    }) {
    // We pass in the initial bounds and get new bounds and drag/resize events
    const [bounds, { onDragStart, onResizeStart, onMove, onStop }] = useMove(annotation as Bounds, onSave)

    // Update the annotation position so we can render the latest version
    // The 'viewer' component hides the currently selected annotation so a double isn't shown
    const movedAnnotation = { ...annotation, ...bounds }

    return <div class="absolute inset-0" onClick={close}
        onMouseMove={onMove} onMouseUp={onStop} onMouseLeave={onStop}>

        {/* The actual annotation is rendered via children */}
        {children(bounds)}

        {/* A hidden area which allow the user to drag the element */}
        <GenericSelectableArea annotation={movedAnnotation}
            class="cursor-move" events={{
                onMouseDown: onDragStart,
                onClick: e => e.stopPropagation(),
            }} />

        {/* Renders the shape-specific resize nodes around the components. */}
        <ResizeUi {...bounds} start={onResizeStart} shape={annotation.shape} />
    </div>
}

/** Renders the draggable nodes that allow for resizing an annotation */
function ResizeUi({ start, shape, ...bounds }: Bounds & { start: onResizeStart, shape: Shape }) {
    const { left, top, width, height } = bounds
    const right = left + width, bottom = top + height

    // Ensure nodes are always on the same edge/corner regardless of negative widths/heights
    const l = Math.min(left, right), t = Math.min(top, bottom)
    const r = Math.max(left, right), b = Math.max(top, bottom)
    const mx = (l + r) / 2, my = (t + b) / 2 // Middle coordinates

    /** The draggable node that allows for resizing an annotation. The 'sides' determine which edges will be updated on resize. */
    function Point(ps: { style: any, top?: boolean, right?: boolean, bottom?: boolean, left?: boolean }) {

        // Account for nagative width/height values so we always move the correct edge/corner
        const negX = width < 0, negY = height < 0
        const left = negX ? ps.right : ps.left, right = negX ? ps.left : ps.right
        const top = negY ? ps.bottom : ps.top, bottom = negY ? ps.top : ps.bottom

        return <div style={ps.style} onMouseDown={e => start(top, right, bottom, left)(e)}
            class="absolute bg-white border-t border-gray-300 w-4 h-4 -ml-2 -mt-2 rounded-full shadow" />
    }

    // Get the shape-specific corners/edges as some shape don't need all nodes
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

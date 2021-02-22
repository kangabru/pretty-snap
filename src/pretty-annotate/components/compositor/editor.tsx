import { h } from 'preact';
import { KeysHeld, useKeysHeld } from '../../../common/hooks/misc';
import { join } from '../../../common/misc/utils';
import { AnnotationAny, Bounds, Shape, StyleOptions } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { setAltBracketBounds } from '../annotations/bracket';
import { getEllipseBounds } from '../annotations/ellipse';
import { DragPane } from './drag-pane';

const clickTypes = new Set([Shape.Counter, Shape.Text])

export default function Editor() {
    return <section class="absolute inset-0">
        <Viewer />
        <EditorPane />
    </section>
}

export function Viewer({ scale }: { scale?: number }) {
    const ids = useAnnotateStore(s => s.ids)
    return <section class="absolute inset-0 pointer-events-none origin-top-left" style={{ transform: scale ? `scale(${scale})` : undefined }}>
        {ids.map(id => <Annotation key={id} id={id} />)}
    </section>
}

function Annotation({ id }: { id: string }) {
    const editing = useAnnotateStore(s => !!s.idEditing)
    const annotation = useAnnotateStore(s => s.index[id] as AnnotationAny)
    return <GenericAnnotation id={id} {...annotation} allowEvents={!editing} />
}

function EditorPane() {
    const style = useAnnotateStore(s => s.style)
    const useClick = clickTypes.has(style.shape)
    return <section class={join("absolute inset-0", useClick ? "cursor-pointer" : "cursor-crosshair")}>
        <DragEdits />
    </section>
}

function DragEdits() {
    const keysHeld = useKeysHeld()
    const style = useAnnotateStore(s => s.style)
    const save = useAnnotateStore(s => s.saveAnnotation)
    const toBounds = (bounds: Bounds) => boundsToData(bounds, style, keysHeld)

    return <DragPane
        onComplete={bounds => { save(toBounds(bounds)) }}
        onRender={bounds => <GenericAnnotation {...style} {...toBounds(bounds)} />} />
}

function boundsToData(bounds: Bounds, options: StyleOptions, keysHeld: KeysHeld): AnnotationAny {
    switch (options.shape) {

        case Shape.Text:
        case Shape.Counter: {
            const [left, top] = toMousePosition(bounds)
            return { ...options, left, top }
        }

        case Shape.Bracket:
            // Fix horizontal/diagonal/vertial direction with shift
            if (keysHeld.shift) fixDirection(bounds)

            // Allow for alt behaviour that flips that direction
            if (keysHeld.alt) setAltBracketBounds(bounds)
            break

        case Shape.Line:
        case Shape.Arrow:
            // Fix horizontal/diagonal/vertial direction with shift
            if (keysHeld.shift) fixDirection(bounds)
            break

        case Shape.Box:
        case Shape.Ellipse:

            // Make perfect square/circle on shift
            if (keysHeld.shift) fixSize(bounds)

            if (options.shape == Shape.Ellipse)
                bounds = getEllipseBounds(bounds, keysHeld.alt)
            break
    }
    return { ...options, ...bounds }
}

/** The bounds define a box so extract the actual mouse coordinates. */
function toMousePosition({ left, top, width, height, negX, negY }: Bounds) {
    const x = left + (negX ? 0 : width)
    const y = top + (negY ? 0 : height)
    return [x, y]
}

/** Updates the bounds to the closest horizontal, diagonal, or vertial shape. */
function fixDirection(bounds: Bounds) {
    const { left, top, width, height, negX, negY } = bounds

    const ratio = Math.abs(height) < 0.05 ? 5 : width / height

    if (ratio < 0.5) {
        bounds.width = 0  // vertical
        bounds.left = left + (negX ? width : 0)
    }
    else if (ratio < 2) fixSize(bounds) // diagonal
    else {
        bounds.height = 0   // horizontal
        bounds.top = top + (negY ? height : 0)
    }
}

/** Updates the bounds to a square. */
function fixSize(bounds: Bounds) {
    const { left, top, width, height, negX, negY } = bounds

    if (width < height) {
        const dh = height - width
        bounds.height = width
        bounds.top = top + (negY ? dh : 0)
    } else {
        const dw = width - height
        bounds.width = height
        bounds.left = left + (negX ? dw : 0)
    }
}
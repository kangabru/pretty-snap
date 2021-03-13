import { h } from 'preact';
import { KeysHeld, useKeysHeld } from '../../../common/hooks/use-misc';
import { join } from '../../../common/misc/utils';
import { Annotation, AnnotationAny, Bounds, Shape, StyleOptions } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { setAltBracketBounds } from '../annotations/bracket';
import { getEllipseBounds } from '../annotations/ellipse';
import { absBounds } from '../annotations/util';
import { DragPane } from './drag-pane';

const clickTypes = new Set([Shape.Counter, Shape.Text])

/** This components allows users to create annotations by clicking/dragging on screen.
 *
 * It works by abstracting a 'drag pane' which is what allows users to perform the drag action.
 * The pane then passed the bounds to a generic annotation components which actually renders the annotation.
 */
export default function Dragger() {
    const style = useAnnotateStore(s => s.style)
    const useClick = clickTypes.has(style.shape)
    return <section aria-label="Annotation edit pane"
        class={join("absolute inset-0", useClick ? "cursor-pointer" : "cursor-crosshair")}>
        <DragEdits />
    </section>
}

function DragEdits() {
    const keysHeld = useKeysHeld()
    const style = useAnnotateStore(s => s.style)
    const toBounds = (bounds: Bounds) => boundsToData(bounds, style, keysHeld)

    return <DragPane onComplete={bounds => onSave(toBounds(bounds))}>
        {bounds => <GenericAnnotation {...style} {...toBounds(bounds)} />}
    </DragPane>
}

/** Performs shape-specific transformations such as:
 * - Fixed aspect ratio sizes
 * - Directional snaps to vertical/horizontal/diagonal axes
 * - Alternate render directions
 *
 * All shapes use the 'Bounds' type which defines a position and size.
 */
function boundsToData(bounds: Bounds, options: StyleOptions, keysHeld: KeysHeld): AnnotationAny {
    switch (options.shape) {

        case Shape.Text:
        case Shape.Counter: {
            // These shape don't have a size, just a fixed position.
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

/** Performs shape-specific saving logic. */
function onSave(annotation: AnnotationAny) {
    const { save, saveText } = useAnnotateStore.getState()

    if (annotation.shape === Shape.Text)
        saveText(annotation as Annotation<Shape.Text>)
    else save(annotation)
}

/** Extracts mouse coordinates from the box bounds as some shapes don't have a size. */
function toMousePosition({ left, top, width, height }: Bounds) {
    return [left + width, top + height] // Note that width and height can be negative
}

/** Updates the bounds to the closest horizontal, diagonal, or vertical shape. */
function fixDirection(bounds: Bounds) {
    const { width, height } = absBounds(bounds)
    const ratio = Math.abs(height) < 0.05 ? 5 : width / height

    if (ratio < 0.5) bounds.width = 0  // vertical
    else if (ratio < 2) fixSize(bounds) // diagonal
    else bounds.height = 0   // horizontal
}

/** Updates the bounds to a square aspect ratio. */
function fixSize(bounds: Bounds) {
    const { width, height } = bounds
    const signW = Math.sign(width), signH = Math.sign(height)
    const size = Math.min(Math.abs(width), Math.abs(height))
    bounds.width = signW * size
    bounds.height = signH * size
}
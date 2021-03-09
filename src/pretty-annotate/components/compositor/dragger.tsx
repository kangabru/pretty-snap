import { h } from 'preact';
import { KeysHeld, useKeysHeld } from '../../../common/hooks/use-misc';
import { join } from '../../../common/misc/utils';
import { AnnotationAny, Bounds, Shape, StyleOptions } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { setAltBracketBounds } from '../annotations/bracket';
import { getEllipseBounds } from '../annotations/ellipse';
import { absBounds } from '../annotations/util';
import { DragPane } from './drag-pane';

const clickTypes = new Set([Shape.Counter, Shape.Text])

/** TODO */
export default function Dragger() {
    const style = useAnnotateStore(s => s.style)
    const useClick = clickTypes.has(style.shape)
    return <section class={join("absolute inset-0", useClick ? "cursor-pointer" : "cursor-crosshair")}>
        <DragEdits />
    </section>
}

function DragEdits() {
    const keysHeld = useKeysHeld()
    const style = useAnnotateStore(s => s.style)
    const save = useAnnotateStore(s => s.save)
    const toBounds = (bounds: Bounds) => boundsToData(bounds, style, keysHeld)

    return <DragPane onComplete={bounds => { save(toBounds(bounds)) }}>
        {bounds => <GenericAnnotation {...style} {...toBounds(bounds)} />}
    </DragPane>
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
function toMousePosition({ left, top, width, height }: Bounds) {
    return [left + width, top + height]
}

/** Updates the bounds to the closest horizontal, diagonal, or vertial shape. */
function fixDirection(bounds: Bounds) {
    const { width, height } = absBounds(bounds)
    const ratio = Math.abs(height) < 0.05 ? 5 : width / height

    if (ratio < 0.5) bounds.width = 0  // vertical
    else if (ratio < 2) fixSize(bounds) // diagonal
    else bounds.height = 0   // horizontal
}

/** Updates the bounds to a square. */
function fixSize(bounds: Bounds) {
    const { width, height } = bounds
    const signW = Math.sign(width), signH = Math.sign(height)
    const size = Math.min(Math.abs(width), Math.abs(height))
    bounds.width = signW * size
    bounds.height = signH * size
}
import { useState } from 'preact/hooks';
import { Bounds } from '../../misc/types';

export type MovePaneProps = {
    initBounds: Bounds,
    close: () => void,
    onSave: (_: Bounds) => void,
}

export type RenderProps = {
    bounds: Bounds,
    onDrag: onDragEvents,
    onResize: onResizeEvents,
}

type Func = () => void
type MouseFunc = (e: MouseEvent) => void
type BoundsFunc = (bounds: Bounds) => void

export type onDragEvents = { start: MouseFunc, move: MouseFunc, stop: Func }
export type onResizeEvents = { start: ResizeFunc, move: MouseFunc, stop: Func }

export function useMove(initBounds: Bounds, onStop: (bounds: Bounds) => void): [Bounds, onDragEvents, onResizeEvents] {
    const [_bounds, setBounds] = useState<Bounds>(initBounds)

    const [isDrag, setIsDrag] = useState(false)
    const [dragBoundsDiff, onDrag] = useDragBox(_bounds, setBounds)
    const [resizeBoundsDiff, onResize] = useResizeBox(_bounds, setBounds)

    const bounds = getBoundedBounds(addBounds(addBounds(_bounds, dragBoundsDiff), resizeBoundsDiff))

    const callFunc = (dragFunc: MouseFunc, resizeFunc: MouseFunc) => (e: MouseEvent) => isDrag ? dragFunc(e) : resizeFunc(e)

    const start = (e: MouseEvent) => { onDrag.start(e); setIsDrag(true) }
    const move = callFunc(onDrag.move, onResize.move)
    const stop = () => {
        callFunc(onDrag.stop, onResize.stop)(null as any)
        setIsDrag(false)
        if (!areBoundsEqual(dragBoundsDiff, resizeBoundsDiff))
            onStop(bounds)
    }

    return [bounds, { start, move, stop }, onResize]
}

function areBoundsEqual(bounds1: Bounds, bounds2: Bounds): boolean {
    return bounds1.top === bounds2.top
        && bounds1.left === bounds2.left
        && bounds1.width === bounds2.width
        && bounds1.height === bounds2.height
        && bounds1.negX === bounds2.negX
        && bounds1.negY === bounds2.negY
}

function addBounds(bounds1: Bounds, bounds2: Bounds): Bounds {
    return {
        ...bounds1,
        left: bounds1.left + bounds2.left,
        top: bounds1.top + bounds2.top,
        width: bounds1.width + bounds2.width,
        height: bounds1.height + bounds2.height,
    }
}

function getBoundedBounds(_bounds: Bounds): Bounds {
    const bounds = { ..._bounds }

    // Account for negative sizes
    if (_bounds.width < 0) {
        bounds.negX = true
        bounds.left += _bounds.width
        bounds.width = -_bounds.width
    }
    if (_bounds.height < 0) {
        bounds.negY = true
        bounds.top += _bounds.height
        bounds.height = -_bounds.height
    }

    return bounds
}

type CoordsXY = { x: number, y: number }

/** Uses a drag point and manipulates your object with the drag coordinates.
 * getResult: Return the diff object based on the drag coords.
 * getResult: Return the final object based on the drag coords.
 */
function useDrag<TResult>(getResult: (bounds: CoordsXY) => TResult, setResult: (result: TResult) => void): [TResult, onDragEvents] {
    const zero: CoordsXY = { y: 0, x: 0 }
    const [isMoving, setIsMoving] = useState(false)
    const [coordsStart, setCoordsStart] = useState<CoordsXY>(zero)
    const [coordsMove, setCoordsMove] = useState<CoordsXY>(zero)

    const dCoords = { x: coordsMove.x - coordsStart.x, y: coordsMove.y - coordsStart.y }
    const resultDiff = getResult(dCoords)

    const getCoords = (e: MouseEvent) => ({ x: e.clientX, y: e.clientY })
    const start = (e: MouseEvent) => {
        setCoordsStart(getCoords(e))
        setCoordsMove(getCoords(e))
        setIsMoving(true)
        e.stopPropagation()
    }
    const move = (e: MouseEvent) => isMoving && setCoordsMove(getCoords(e))
    const stop = () => {
        setIsMoving(false)
        setResult(resultDiff)
        setCoordsStart(zero) // reset
        setCoordsMove(zero) // reset
    }

    return [resultDiff, { start, move, stop }]
}

function useDragBox(bounds: Bounds, setBounds: (bounds: Bounds) => void): [Bounds, onDragEvents] {
    return useDrag(
        c => ({ left: c.x, top: c.y, width: 0, height: 0, negX: false, negY: false }),
        boundsDiff => setBounds(addBounds(bounds, boundsDiff))
    )
}

type ResizeFunc = (top?: boolean, right?: boolean, bottom?: boolean, left?: boolean) => MouseFunc

function useResizeBox(_bounds: Bounds, setBounds: BoundsFunc): [Bounds, onResizeEvents] {
    const [sides, setSides] = useState({ top: false, right: false, bottom: false, left: false })
    const [bounds, { start: _start, move, stop }] = useDrag(
        dCoords => getResizedBounds(dCoords, sides),
        boundsDiff => setBounds(addBounds(_bounds, boundsDiff))
    )

    const start = (top?: boolean, right?: boolean, bottom?: boolean, left?: boolean) => {
        if (sides.left != left || sides.top != top || sides.right != right || sides.bottom != bottom)
            setSides({ left: !!left, top: !!top, right: !!right, bottom: !!bottom })
        return _start
    }

    return [bounds, { start, move, stop }]
}

function getResizedBounds(dCoords: CoordsXY, sides: { top?: boolean, right?: boolean, bottom?: boolean, left?: boolean }): Bounds {
    const newBounds: Bounds = { left: 0, top: 0, width: 0, height: 0, negX: false, negY: false }

    if (sides.left) {
        newBounds.left += dCoords.x
        newBounds.width -= dCoords.x
    }

    if (sides.top) {
        newBounds.top += dCoords.y
        newBounds.height -= dCoords.y
    }

    if (sides.right) newBounds.width += dCoords.x
    if (sides.bottom) newBounds.height += dCoords.y

    return newBounds
}

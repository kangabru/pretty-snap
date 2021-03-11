import { useState } from 'preact/hooks';
import { MouseFunc } from '../../common/misc/types';
import { Bounds } from '../misc/types';

type BoundsFunc = (bounds: Bounds) => void

// Combined events to be used on a background pane
type onMove = MouseFunc
type onStop = () => void

// Independent events to be used on 'initiator' elements like buttons
type onDragStart = MouseFunc
export type onResizeStart = (top?: boolean, right?: boolean, bottom?: boolean, left?: boolean) => MouseFunc

type onDragEvents = { start: onDragStart, move: onMove, stop: onStop }
type onResizeEvents = { start: onResizeStart, move: onMove, stop: onStop }

/** The exposed events for drag and resizing.
 * @param onStartDrag -   An 'onMouseDown' function to call to initiate a drag event.   This should be used on an 'initiator' element like a draggable button.
 * @param onStartResize - An 'onMouseDown' function to call to initiate a resize event. This should be used on an 'initiator' element like a draggable button.
 * @param onMove - An 'onMouseMove' function to call to modify the drag/resize event.   This should be used on a large pane behind the 'initiator' element.
 * @param onStop - An 'onMouseUp'-like function to call to initiase a resize event.     This should be used on a large pane behind the 'initiator' element.
 */
type MouseEvents = { onDragStart: onDragStart, onResizeStart: onResizeStart, onMove: onMove, onStop: onStop }

/** Enables drag and resize functionality via mouse events.
 *
 * @param initBounds - The initial bounds that will be transformed by the drag/resize events.
 * @param onFinish - The callback to fire once a drag/resize event completes.
 * @returns [<bounds>, <events>]
 *      - The current bounds with drag and resize transformations applied
 *      - The events used to start/move/end drag and resize events.
 */
export function useMove(initBounds: Bounds, onFinish: BoundsFunc): [Bounds, MouseEvents] {
    const [_bounds, setBounds] = useState<Bounds>(initBounds)

    // Get the separated drag and resize bounds and functions
    const [dragBoundsDiff, onDrag] = useDragBox(_bounds, setBounds)
    const [resizeBoundsDiff, onResize] = useResizeBox(_bounds, setBounds)

    // Merge all bounds
    const bounds = addBounds(addBounds(_bounds, dragBoundsDiff), resizeBoundsDiff)

    // We need to combine the drag and resize functions for common events like 'move'
    // We do this must tracking what event we doing then choosing the right function
    const [isDrag, setIsDrag] = useState(false)
    const callFunc = (dragFunc: MouseFunc, resizeFunc: MouseFunc) => (e: MouseEvent) => isDrag ? dragFunc(e) : resizeFunc(e)

    // Independent events to be used on 'initiator' elements like buttons
    const onDragStart: onDragStart = (e: MouseEvent) => { onDrag.start(e); setIsDrag(true) }
    const onResizeStart: onResizeStart = onResize.start

    // Combined events to be used on a background pane
    const onMove = callFunc(onDrag.move, onResize.move)
    const onStop = () => {
        callFunc(onDrag.stop, onResize.stop)(null as any)
        setIsDrag(false)
        if (!areBoundsEqual(dragBoundsDiff, resizeBoundsDiff))
            onFinish(bounds) // e.g. for external saves once the user stops dragging
    }

    return [bounds, { onDragStart, onResizeStart, onMove, onStop }]
}

function areBoundsEqual(bounds1: Bounds, bounds2: Bounds): boolean {
    return bounds1.top === bounds2.top
        && bounds1.left === bounds2.left
        && bounds1.width === bounds2.width
        && bounds1.height === bounds2.height
}

function addBounds(bounds1: Bounds, bounds2: Bounds): Bounds {
    return {
        left: bounds1.left + bounds2.left,
        top: bounds1.top + bounds2.top,
        width: bounds1.width + bounds2.width,
        height: bounds1.height + bounds2.height,
    }
}

type CoordsXY = { x: number, y: number }

/** The core hook which tracks a drag via two coordinates.
 * @param getResult - The function which transforms the internal coordiantes into a more usable 'Bounds' object.
 * @param setResult - The callback that's run once the drag event completes.
 * @returns [<bounds>, <events>]
 *      - The current bounds with drag transformations applied
 *      - The events used to start/move/end the drag event.
 */
function useDrag<TResult>(getResult: (bounds: CoordsXY) => TResult, setResult: (result: TResult) => void): [TResult, onDragEvents] {
    const zero: CoordsXY = { y: 0, x: 0 }
    const [isMoving, setIsMoving] = useState(false)

    // Track the drag via two coordinates
    const [coordsStart, setCoordsStart] = useState<CoordsXY>(zero)
    const [coordsMove, setCoordsMove] = useState<CoordsXY>(zero)

    const toCoords = (e: MouseEvent) => ({ x: e.clientX, y: e.clientY })
    const bounds = getResult({ x: coordsMove.x - coordsStart.x, y: coordsMove.y - coordsStart.y })

    return [bounds, {
        start: (e: MouseEvent) => {
            setCoordsStart(toCoords(e))
            setCoordsMove(toCoords(e))
            setIsMoving(true)
            e.stopPropagation()
        },
        move: (e: MouseEvent) => isMoving && setCoordsMove(toCoords(e)),
        stop: () => {
            setResult(bounds)
            setIsMoving(false)
            setCoordsStart(zero) // reset
            setCoordsMove(zero) // reset
        },
    }]
}

/** Allows the dragging of a 'Bounds' objects via mouse events. */
function useDragBox(bounds: Bounds, setBounds: BoundsFunc): [Bounds, onDragEvents] {
    // Wrap the core drag hook to simply translate the given bounds
    return useDrag(
        c => ({ left: c.x, top: c.y, width: 0, height: 0 }),
        boundsDiff => setBounds(addBounds(bounds, boundsDiff))
    )
}

/** Allows the resizing of a 'Bounds' objects via mouse events. */
function useResizeBox(_bounds: Bounds, setBounds: BoundsFunc): [Bounds, onResizeEvents] {
    // The config that controls which edges will be transformed by the core drag event
    const [sides, setSides] = useState({ top: false, right: false, bottom: false, left: false })

    // Wrap the core drag hook to resize the given bounds
    const [bounds, { start: _start, move, stop }] = useDrag(
        dCoords => getResizedBounds(dCoords, sides),
        boundsDiff => setBounds(addBounds(_bounds, boundsDiff))
    )

    /** Wrap the start function but expose the 'sides' config so individual nodes can be configured to resize various corners/side
     * @example The top left node will call this with 'top' and 'left' side set to true
     * @returns A mouse event to initiate the resize event
     */
    const start: onResizeStart = (top?: boolean, right?: boolean, bottom?: boolean, left?: boolean) => {
        if (sides.left != left || sides.top != top || sides.right != right || sides.bottom != bottom)
            setSides({ left: !!left, top: !!top, right: !!right, bottom: !!bottom })
        return _start
    }

    return [bounds, { start, move, stop }]
}

/** Resizes bounds based on the given coordinates and 'sides config'. */
function getResizedBounds(dCoords: CoordsXY, sides: { top?: boolean, right?: boolean, bottom?: boolean, left?: boolean }): Bounds {
    const bounds: Bounds = { left: 0, top: 0, width: 0, height: 0 }

    if (sides.left) {
        bounds.left += dCoords.x
        bounds.width -= dCoords.x
    }

    if (sides.top) {
        bounds.top += dCoords.y
        bounds.height -= dCoords.y
    }

    if (sides.right) bounds.width += dCoords.x
    if (sides.bottom) bounds.height += dCoords.y

    return bounds
}

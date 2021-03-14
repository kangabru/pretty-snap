import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import useMeasure from 'react-use-measure';
import { ChildrenWithProps } from '../../../common/misc/types';
import { Bounds, Position } from '../../misc/types';

/** A component which a user can drag onto to create shapes. */
export function DragPane({ children, onComplete }: ChildrenWithProps<Bounds> & { onComplete: (_: Bounds) => void }) {
    const [ref, cont] = useMeasure({ scroll: true })

    // Track the start/end positions of the drag event
    const [pos1, setPos1] = useState<Position | undefined>(undefined)
    const [pos2, setPos2] = useState<Position | undefined>(undefined)

    // Transform positions into our 'Bounds' objects
    const [left, top, width, height] = useMemo(() => {
        const x1 = pos1?.left ?? 0, x2 = pos2?.left ?? 0
        const y1 = pos1?.top ?? 0, y2 = pos2?.top ?? 0
        return [x1, y1, x2 - x1, y2 - y1]
    }, [pos1, pos2])

    const onMouseDown = (ev: MouseEvent) => {
        const pos = { left: ev.clientX - cont.x, top: ev.clientY - cont.y }
        setPos1(pos); setPos2(pos)
    }

    const onMouseMove = (ev: MouseEvent) => pos2 && setPos2({ left: ev.clientX - cont.x, top: ev.clientY - cont.y })
    const onMouseUp = () => {
        onComplete?.({ left, top, width, height })
        setPos1(undefined); setPos2(undefined)
    }

    // Render the background pane and pass bounds to children
    return <div ref={ref} {...{ onMouseDown, onMouseUp, onMouseMove }} class="absolute inset-0">
        {pos1 && pos2 && children({ left, top, width, height })}
    </div>
}

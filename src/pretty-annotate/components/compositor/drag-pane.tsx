import React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { Bounds, Position } from '../../misc/types';

export type DragPaneProps = {
    onRender: (_: Bounds) => JSX.Element,
    onComplete: (_: Bounds) => void,
}

/** A component which a user can drag onto to create shapes. */
export function DragPane(props: DragPaneProps) {
    const [ref, cont] = useMeasure({ scroll: true })
    const [pos1, setPos1] = useState<Position | undefined>(undefined)
    const [pos2, setPos2] = useState<Position | undefined>(undefined)

    // Calculate the position accounting for negative values (i.e. dragging above and to the left)
    const [left, top, width, height, negX, negY] = useMemo(() => {
        const x1 = pos1?.left ?? 0, x2 = pos2?.left ?? 0
        const y1 = pos1?.top ?? 0, y2 = pos2?.top ?? 0
        const left = Math.min(x1, x2), top = Math.min(y1, y2)
        const width = Math.abs(x1 - x2), height = Math.abs(y1 - y2)
        const negX = x2 < x1, negY = y2 < y1
        return [left - cont.x, top - cont.y, width, height, negX, negY]
    }, [pos1, pos2, cont.x, cont.y])

    const onMouseDown = (ev: any) => {
        const pos = { left: ev.clientX, top: ev.clientY }
        setPos1(pos); setPos2(pos)
    }

    const onMouseMove = (ev: any) => pos2 && setPos2({ left: ev.clientX, top: ev.clientY })
    const onMouseUp = () => {
        props.onComplete?.({ left, top, width, height, negX, negY })
        setPos1(undefined); setPos2(undefined)
    }

    return <div ref={ref} {...{ onMouseDown, onMouseUp, onMouseMove }} className="absolute inset-0">
        {pos1 && pos2 && props.onRender({ left, top, width, height, negX, negY })}
    </div>
}
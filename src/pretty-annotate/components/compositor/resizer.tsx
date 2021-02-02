import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useMemo } from 'react';
import useMeasure from 'react-use-measure';

export type Size = { width: number, height: number }
export type Position = { left: number, top: number }
export type Dimensions = Size & Position
export type DimensionsNeg = Size & Position & { negX: boolean, negY: boolean }

type DraggerProps = {
    onComplete?: (dims: DimensionsNeg) => void,
    render: (dims: DimensionsNeg) => JSX.Element,
}

/** A component which a user can drag onto to create shapes. */
export function Dragger(props: DraggerProps) {
    const [ref, cont] = useMeasure()
    const [pos1, setPos1] = useState<Position | undefined>(undefined)
    const [pos2, setPos2] = useState<Position | undefined>(undefined)

    // Calculate the position accounting for negative values (i.e. dragging above and to the left)
    const [left, top, width, height, negX, negY] = useMemo(() => {
        const x1 = pos1?.left ?? 0, x2 = pos2?.left ?? 0
        const y1 = pos1?.top ?? 0, y2 = pos2?.top ?? 0
        const left = Math.min(x1, x2), top = Math.min(y1, y2)
        const width = Math.abs(x1 - x2), height = Math.abs(y1 - y2)
        const negX = x2 < x1, negY = y2 < y1
        return [left - cont.left, top - cont.top, width, height, negX, negY]
    }, [pos1, pos2, cont.left, cont.top])

    const onMouseDown = (ev: MouseEvent) => {
        const pos = { left: ev.clientX, top: ev.clientY + window.scrollY }
        setPos1(pos); setPos2(pos)
    }

    const onMouseMove = (ev: MouseEvent) => pos2 && setPos2({ left: ev.clientX, top: ev.clientY + window.scrollY })
    const onMouseUp = () => {
        props.onComplete?.({ left, top, width, height, negX, negY })
        setPos1(undefined); setPos2(undefined)
    }

    return <div ref={ref} {...{ onMouseDown, onMouseUp, onMouseMove }} class="absolute inset-0">
        {pos1 && pos2 && props.render({ left, top, width, height, negX, negY })}
    </div>
}

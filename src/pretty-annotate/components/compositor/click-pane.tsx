import React, { useState } from 'react';
import useMeasure from 'react-use-measure';
import { Position } from '../../misc/types';

export type ClickPaneProps = {
    onRender: (_: Position) => JSX.Element,
    onComplete: (_: Position) => void,
}

/** A component which a user can drag onto to create shapes. */
export function ClickPane(props: ClickPaneProps) {
    const [ref, cont] = useMeasure({ scroll: true })
    const [pos, setPos] = useState<Position | undefined>(undefined)

    const left = pos ? (pos.left - cont.x) : 0
    const top = pos ? (pos.top - cont.y) : 0

    const onMouseDown = (ev: any) => setPos({ left: ev.clientX, top: ev.clientY })
    const onMouseMove = (ev: any) => pos && setPos({ left: ev.clientX, top: ev.clientY })
    const onMouseUp = () => {
        pos && props.onComplete({ left, top })
        setPos(undefined)
    }

    return <div ref={ref} {...{ onMouseDown, onMouseUp, onMouseMove }} className="absolute inset-0">
        {pos && props.onRender({ left, top })}
    </div>
}

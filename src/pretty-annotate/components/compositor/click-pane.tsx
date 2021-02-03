import { h } from 'preact';
import { useState } from 'preact/hooks';
import useMeasure from 'react-use-measure';
import { Position } from '../../misc/types';

export type ClickPaneProps = {
    onRender: (_: Position) => JSX.Element,
    onComplete: (_: Position) => void,
}

/** A component which a user can drag onto to create shapes. */
export function ClickPane(props: ClickPaneProps) {
    const [ref, cont] = useMeasure()
    const [pos, setPos] = useState<Position | undefined>(undefined)

    const left = pos ? (pos.left - cont.left) : 0
    const top = pos ? (pos.top - cont.top) : 0

    const onMouseDown = (ev: MouseEvent) => setPos({ left: ev.clientX, top: ev.clientY + window.scrollY })
    const onMouseMove = (ev: MouseEvent) => pos && setPos({ left: ev.clientX, top: ev.clientY + window.scrollY })
    const onMouseUp = () => {
        pos && props.onComplete({ left, top })
        setPos(undefined)
    }

    return <div ref={ref} {...{ onMouseDown, onMouseUp, onMouseMove }} class="absolute inset-0">
        {pos && props.onRender({ left, top })}
    </div>
}

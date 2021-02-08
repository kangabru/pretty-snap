import { Fragment, h } from 'preact';
import { DASH, STROKE } from '../../misc/constants';
import { Style, Annotation } from '../../misc/types';
import { GetLineCoords, LineDashed, LineSolid } from './line';

type ArrowProps = Annotation<Style.Arrow>

export const ArrowHeadMargin = DASH  // Allow for arrow head length and margin

export default function Arrow(props: ArrowProps) {
    return props.dashed ? <ArrowDashed {...props} /> : <ArrowSolid {...props} />
}

function ArrowSolid(props: ArrowProps) {
    return <LineSolid {...props}><ArrowHead {...props} /></LineSolid>
}

function ArrowDashed(props: ArrowProps) {
    return <LineDashed {...props}><ArrowHead {...props} /></LineDashed>
}

function ArrowHead(props: ArrowProps) {
    const [, , x2, y2] = GetLineCoords(props, ArrowHeadMargin, ArrowHeadMargin)

    const { width, height, negX, negY } = props
    const angle = Math.atan2(negX ? -width : width, negY ? -height : height)

    const show = width ** 2 + height ** 2 > (2 * DASH) ** 2

    return <>
        {show && <ArrowLine x={x2} y={y2} angle={angle - Math.PI * 0.8} />}
        {show && <ArrowLine x={x2} y={y2} angle={angle - Math.PI * 1.2} />}
    </>
}

function ArrowLine({ x, y, angle }: { x: number, y: number, angle: number }) {
    const x2 = x + DASH * Math.sin(angle)
    const y2 = y + DASH * Math.cos(angle)
    return <line x1={x} y1={y} x2={x2} y2={y2} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={STROKE} />
}

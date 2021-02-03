import { h } from 'preact';
import { animated } from 'react-spring';
import useNiceDashLength from '../../hooks/use-dash';
import { STROKE } from '../../misc/constants';
import { Style, StyleData } from '../../misc/types';

type LineProps = StyleData<Style.Line>

export default function Line(props: LineProps) {
    return props.dashed ? <LineDashed {...props} /> : <LineSolid {...props} />
}

function LineSolid(props: LineProps) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2

    const { left, top, width, height } = props
    const [x1, y1, x2, y2] = GetCoords(props)

    return <div class="absolute" style={{ left: left - strokeMargin, top: top - strokeMargin }}>
        <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
            <animated.line x1={x1} y1={y1} x2={x2} y2={y2} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={strokeWidth} />
        </svg>
    </div>
}

function LineDashed(props: LineProps) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2
    const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth }

    const { left, top, width, height } = props
    const [x1, y1, x2, y2] = GetCoords(props)

    const lineLength = Math.sqrt(width ** 2 + height ** 2)
    const [dashArray, dashOffset] = useNiceDashLength(lineLength, 16)

    return <div class="absolute" style={{ left: left - strokeMargin, top: top - strokeMargin }}>
        <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
            <animated.line x1={x1} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
        </svg>
    </div>
}

function GetCoords({ width, height, negX, negY }: LineProps) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2

    // Adjust the bounds by half the stroke width so the svg doesn't clip off the edges
    const x1 = strokeMargin + (negX ? width : 0)
    const y1 = strokeMargin + (negY ? height : 0)
    const x2 = x1 + (negX ? -1 : 1) * width
    const y2 = y1 + (negY ? -1 : 1) * height
    return [x1, y1, x2, y2]
}
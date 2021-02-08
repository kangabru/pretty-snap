import { h } from 'preact';
import { animated } from 'react-spring';
import useNiceDashLength from '../../hooks/use-dash';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Bounds, Style } from '../../misc/types';
import { ArrowHeadMargin } from './arrow';

type LineProps = Annotation<Style.Line>

export default function Line(props: LineProps) {
    return props.dashed ? <LineDashed {...props} /> : <LineSolid {...props} />
}

function LineContainer({ children, left, top, width, height, colour }: Bounds & { colour: string } & JSX.ElementChildrenAttribute) {
    const margin = ArrowHeadMargin, strokeMargin = STROKE / 2
    return <div class="absolute" style={{ color: colour, left: left - margin - strokeMargin, top: top - margin - strokeMargin }}>
        <svg fill="currentColor" width={width + 2 * margin} height={height + 2 * margin} xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    </div>
}

export function LineSolid({ children, ...props }: LineProps & { children?: JSX.Element }) {
    const margin = ArrowHeadMargin
    const [x1, y1, x2, y2] = GetLineCoords(props, margin, margin)

    return <LineContainer {...props}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={STROKE} />
        {children}
    </LineContainer>
}

export function LineDashed({ children, ...props }: LineProps & { children?: JSX.Element }) {

    const { width, height } = props
    const margin = ArrowHeadMargin
    const [x1, y1, x2, y2] = GetLineCoords(props, margin, margin)

    const lineLength = Math.sqrt(width ** 2 + height ** 2)
    const [dashArray, dashOffset] = useNiceDashLength(lineLength, DASH)
    const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth: STROKE }

    return <LineContainer {...props}>
        <animated.line x1={x1} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
        {children}
    </LineContainer>
}

export function GetLineCoords({ width, height, negX, negY }: LineProps, dx = 0, dy = 0) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2
    const x1 = strokeMargin + (negX ? width : 0)
    const y1 = strokeMargin + (negY ? height : 0)
    const x2 = x1 + (negX ? -1 : 1) * width
    const y2 = y1 + (negY ? -1 : 1) * height
    return [x1 + dx, y1 + dy, x2 + dx, y2 + dy]
}
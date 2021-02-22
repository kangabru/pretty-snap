import { h } from 'preact';
import { animated } from 'react-spring';
import useNiceDashLength from '../../hooks/use-dash';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Shape } from '../../misc/types';

type BoxProps = Annotation<Shape.Box>

const strokeMargin = STROKE / 2

export default function Box(props: BoxProps) {
    return props.style.dashed ? <BoxDashed {...props} /> : <BoxSolid {...props} />
}

export function SvgBoxContainer({ children, left, top, width, height, color: { color } }: BoxProps & JSX.ElementChildrenAttribute) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2 // Adjust the bounds so svg doesn't clip stroke edges
    return <div class="absolute" style={{ color, left: left - strokeMargin, top: top - strokeMargin }}>
        <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    </div>
}

function BoxSolid(props: BoxProps) {
    const { width, height, style: { fillOpacity } } = props
    return <SvgBoxContainer {...props}>
        <rect x={strokeMargin} y={strokeMargin} width={width} height={height}
            fill={fillOpacity ? "currentColor" : "none"} opacity={fillOpacity}
            stroke="currentColor" strokeLinejoin="round" strokeWidth={STROKE} />
    </SvgBoxContainer>
}

function BoxDashed(props: BoxProps) {
    const { width, height } = props
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2

    const [dashArrayW, dashOffsetW] = useNiceDashLength(width, DASH, { shortCorners: true })
    const [dashArrayH, dashOffsetH] = useNiceDashLength(height, DASH, { shortCorners: true })
    const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth }

    // Adjust the bounds by half the stroke width so the svg doesn't clip off the edges
    const x1 = strokeMargin, y1 = strokeMargin, x2 = x1 + width, y2 = y1 + height

    return <SvgBoxContainer {...props}>
        <animated.line x1={x1} y1={y1} x2={x2} y2={y1} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} /> {/* Top */}
        <animated.line x1={x1} y1={y2} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} /> {/* Bottom */}
        <animated.line x1={x1} y1={y1} x2={x1} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} /> {/* Left */}
        <animated.line x1={x2} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} /> {/* Right */}
    </SvgBoxContainer>
}
import { h } from 'preact';
import { animated } from 'react-spring';
import useNiceDashLength from '../../hooks/use-dash';
import { STROKE } from '../../misc/constants';
import { Style, StyleData } from '../../misc/types';

type BoxProps = StyleData<Style.Box>

export default function Box(props: BoxProps) {
    return props.dashed ? <BoxDashed {...props} /> : <BoxSolid {...props} />
}

function BoxSolid({ left, top, width, height }: BoxProps) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2

    // Adjust the bounds by half the stroke width so the svg doesn't clip off the edges
    const x1 = strokeMargin, y1 = strokeMargin

    return <div class="absolute" style={{ left: left - strokeMargin, top: top - strokeMargin }}>
        <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
            <rect x={x1} y={y1} width={width} height={height} fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={strokeWidth} />
        </svg>
    </div>
}

function BoxDashed({ left, top, width, height }: BoxProps) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2

    const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth }
    const [dashArrayW, dashOffsetW] = useNiceDashLength(width, 16, true)
    const [dashArrayH, dashOffsetH] = useNiceDashLength(height, 16, true)

    // Adjust the bounds by half the stroke width so the svg doesn't clip off the edges
    const x1 = strokeMargin, y1 = strokeMargin
    const x2 = x1 + width, y2 = y1 + height

    return <div class="absolute" style={{ left: left - strokeMargin, top: top - strokeMargin }}>
        <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
            <animated.line x1={x1} y1={y1} x2={x2} y2={y1} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} /> {/* Top */}
            <animated.line x1={x1} y1={y2} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} /> {/* Bottom */}
            <animated.line x1={x1} y1={y1} x2={x1} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} /> {/* Left */}
            <animated.line x1={x2} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} /> {/* Right */}
        </svg>
    </div>
}
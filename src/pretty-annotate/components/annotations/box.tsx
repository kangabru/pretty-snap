import { h } from 'preact';
import { animated, useSpring, useSprings } from 'react-spring';
import { SelectableAreaProps } from '.';
import useDevMode from '../../../common/hooks/use-dev-mode';
import { join } from '../../../common/misc/utils';
import useNiceDashLength from '../../hooks/use-dash';
import { useFillOpacity } from '../../hooks/use-styles';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Bounds, Shape, ShapeStyle } from '../../misc/types';
import { absBounds, editOnClick, useSpringBounds } from './util';

type BoxProps = Annotation<Shape.Box>

const strokeMargin = STROKE / 2

export default function Box(props: BoxProps) {
    return props.shapeStyle == ShapeStyle.OutlineDashed ? <BoxDashed {...props} /> : <BoxSolid {...props} />
}

export function SvgBoxContainer({ id, children, color: { color }, ...bounds }: BoxProps & JSX.ElementChildrenAttribute) {
    const strokeWidth = STROKE, strokeMargin = strokeWidth / 2 // Adjust the bounds so svg doesn't clip stroke edges

    const { left, top, width, height } = useSpringBounds(bounds)
    return <animated.div onMouseDown={editOnClick(id)} className="absolute" style={{
        color,
        left: left.interpolate(l => l - strokeMargin),
        top: top.interpolate(t => t - strokeMargin),
    }}>
        <animated.svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"
            width={width.interpolate(w => w + strokeWidth)} height={height.interpolate(h => h + strokeWidth)}>
            {children}
        </animated.svg>
    </animated.div>
}

function BoxSolid(props: BoxProps) {
    const { shapeStyle } = props
    const { width, height } = useSpringBounds(props)

    const fillOpacity = useFillOpacity(shapeStyle)
    return <SvgBoxContainer {...props}>
        <animated.rect x={strokeMargin} y={strokeMargin} width={width} height={height}
            fill={fillOpacity ? "currentColor" : "none"} opacity={fillOpacity}
            stroke="currentColor" strokeLinejoin="round" strokeWidth={STROKE} />
    </SvgBoxContainer>
}

function BoxDashed(props: BoxProps) {
    const { width, height } = absBounds(props)
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

export function BoxSelectableArea({ annotation, events, class: cls }: SelectableAreaProps) {
    const isDevMode = useDevMode()
    return <div style={absBounds(annotation as Bounds)} {...events}
        class={join("absolute", cls, isDevMode && "bg-black bg-opacity-30")} />
}

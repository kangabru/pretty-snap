import { h } from 'preact';
import { animated } from 'react-spring';
import { Children } from '../../../common/misc/types';
import useNiceDashLength from '../../hooks/use-dash';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Bounds, ColorStyle, Shape } from '../../misc/types';

type PaddingProps = { padding?: number }
type LineProps = Annotation<Shape.Line> & PaddingProps

export default function Line(props: LineProps) {
    return props.style.dashed ? <LineDashed {...props} /> : <LineSolid {...props} />
}

export function SvgLineContainer({ children, ...props }: Children & Bounds & PaddingProps & { color: ColorStyle }) {
    const { left, top, width, height, color: { color } } = props

    // Expand the svg bounds to account for content extending beyond the selected width and height
    const padding = props.padding ?? STROKE / 2

    return <div class="absolute" style={{ color, left: left - padding, top: top - padding }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            width={width + 2 * padding} height={height + 2 * padding}>
            <g style={{ transform: `translateX(${padding}px) translateY(${padding}px)` }}>
                {children}
            </g>
        </svg>
    </div>
}

export function LineSolid({ children, ...props }: LineProps & { children?: JSX.Element }) {
    const [x1, y1, x2, y2] = GetLineCoords(props)

    return <SvgLineContainer {...props}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={STROKE} />
        {children}
    </SvgLineContainer>
}

export function LineDashed({ children, ...props }: LineProps & { children?: JSX.Element }) {

    const { width, height } = props
    const [x1, y1, x2, y2] = GetLineCoords(props)

    const lineLength = Math.sqrt(width ** 2 + height ** 2)
    const [dashArray, dashOffset] = useNiceDashLength(lineLength, DASH)
    const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth: STROKE }

    return <SvgLineContainer {...props}>
        <animated.line x1={x1} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
        {children}
    </SvgLineContainer>
}

export function GetLineCoords({ width, height, negX, negY }: LineProps) {
    const x1 = (negX ? width : 0)
    const y1 = (negY ? height : 0)
    const x2 = x1 + (negX ? -1 : 1) * width
    const y2 = y1 + (negY ? -1 : 1) * height
    return [x1, y1, x2, y2]
}
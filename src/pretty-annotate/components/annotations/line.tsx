import { h } from 'preact';
import { animated } from 'react-spring';
import { SelectableAreaProps } from '.';
import useDevMode from '../../../common/hooks/use-dev-mode';
import { Children } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import useNiceDashLength from '../../hooks/use-dash';
import { DASH, STROKE, STROKE_MOVABLE_LINE } from '../../misc/constants';
import { Annotation, Bounds, ColorStyle, Shape, ShapeStyle } from '../../misc/types';
import { absBounds, editAnnotationOnClick } from './util';

type PaddingProps = { padding?: number }
type LineProps = Annotation<Shape.Line> & PaddingProps

export default function Line(props: LineProps) {
    return props.shapeStyle == ShapeStyle.OutlineDashed ? <LineDashed {...props} /> : <LineSolid {...props} />
}

export function SvgLineContainer({ children, ...props }: Children & Bounds & PaddingProps & { id?: string, color: ColorStyle }) {
    const { id, color: { color } } = props
    const { left, top, width, height } = absBounds(props)

    // Expand the svg bounds to account for content extending beyond the selected width and height
    const padding = props.padding ?? STROKE / 2

    return <div onClick={editAnnotationOnClick(id)} class="absolute" style={{ color, left: left - padding, top: top - padding }}>
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

export function GetLineCoords({ width, height }: Pick<LineProps, 'width' | 'height'>) {
    const negX = width < 0, negY = height < 0
    const x1 = negX ? -width : 0, x2 = negX ? 0 : width
    const y1 = negY ? -height : 0, y2 = negY ? 0 : height
    return [x1, y1, x2, y2]
}

export function LineSelectableArea({ annotation, events, class: cls }: SelectableAreaProps) {
    const { left, top, width, height } = absBounds(annotation as Bounds)
    const [x1, y1, x2, y2] = GetLineCoords(annotation as Bounds)
    const stroke = STROKE_MOVABLE_LINE, padding = stroke / 2
    const isDevMode = useDevMode()
    return <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
        class={join("absolute", isDevMode ? "opacity-30" : "opacity-0")}
        style={{ left: left - padding, top: top - padding }} width={width + stroke} height={height + stroke}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} {...events} class={join("cursor-pointer", cls)}
            style={{ transform: `translateX(${padding}px) translateY(${padding}px)` }}
            fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={stroke} />
    </svg>
}

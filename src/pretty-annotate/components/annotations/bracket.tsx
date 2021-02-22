import { h } from 'preact';
import { animated } from 'react-spring';
import { Children } from '../../../common/misc/types';
import useNiceDashLength from '../../hooks/use-dash';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Shape } from '../../misc/types';
import { SvgLineContainer } from './line';

type BracketProps = Annotation<Shape.Bracket>

export default function Bracket(props: BracketProps) {
    return props.style.dashed ? <BracketDashed {...props} /> : <BracketSolid {...props} />
}

function SvgBracketContainer({ children, ...props }: Children & BracketProps) {
    const [dx, dy, angle] = getTransformBounds(props)
    const margin = getBracketPadding(props.width, props.height)
    return <SvgLineContainer {...props} padding={margin}>
        <g style={{ transform: `translateX(${dx}px) translateY(${dy}px) rotate(${angle}rad)` }}
            fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" strokeWidth={STROKE}>{children}</g>
    </SvgLineContainer>
}

export function BracketSolid(props: BracketProps) {
    return <SvgBracketContainer {...props}><path d={GetSolidPath(props)} /></SvgBracketContainer>
}

export function BracketDashed({ children, ...props }: BracketProps & { children?: JSX.Element }) {
    const [dPath1, dPath2] = GetDashedPaths(props)

    const lineLength = getBracketLength(props.width, props.height)
    const [dashArray, dashOffset] = useNiceDashLength(lineLength, DASH, { evenCount: true })

    return <SvgBracketContainer {...props}>
        <animated.path d={dPath1} strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
        <animated.path d={dPath2} strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
    </SvgBracketContainer>
}

function GetSolidPath(props: BracketProps): string {
    const { width, height } = props
    const [rad, span] = getSpanLength(width, height)
    return GetSolidBracketPath(rad, span)
}

/** Returns the 'd' value of an svg <path> element which defines a horizontal bracket going from left to right. */
export function GetSolidBracketPath(rad: number, span: number, dx = 0, dy = 0): string {

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#arcs
    const cornorBL = `a${rad},${rad} 0 0 0 ${rad},${rad}`
    const cornorTR = `a${rad},${rad} 0 0 1 ${rad},${rad}`
    const cornorTL = `a${rad},${rad} 0 0 1 ${rad},-${rad}`
    const cornorBR = `a${rad},${rad} 0 0 0 ${rad},-${rad}`

    return `M${dx},${dy} ${cornorBL} h${span} ${cornorTR} ${cornorTL} h${span} ${cornorBR}`
}

/** Returns two 'd' values of an svg <path> element which defines a horizontal bracket going from left to right.
 * Two paths are returned which define two halves of the bracket. Each half starts
 * from the middle so that animations occur at the edges instead of at the middle.
 */
function GetDashedPaths({ width, height }: BracketProps): [string, string] {
    const [rad, span] = getSpanLength(width, height)

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#arcs
    const cornorTR = `a${rad},${rad} 0 0 0 -${rad},-${rad}`
    const cornorBL = `a${rad},${rad} 0 0 1 -${rad},-${rad}`
    const cornorTL = `a${rad},${rad} 0 0 1 ${rad},-${rad}`
    const cornorBR = `a${rad},${rad} 0 0 0 ${rad},-${rad}`

    // Start from the middle so the edges animate
    const xMid = span + 2 * rad, yMid = 2 * rad
    const dPath1 = `M${xMid},${yMid} ${cornorTR} h-${span} ${cornorBL}`
    const dPath2 = `M${xMid},${yMid} ${cornorTL} h${span} ${cornorBR}`

    return [dPath1, dPath2]
}

/** The bracket svg is defined as a horizontal line so this function returns
 * the translation and rotation values necessary to render it along the drawn path. */
function getTransformBounds({ width, height, negX, negY }: BracketProps) {
    const sx = negX ? -1 : 1, sy = negY ? -1 : 1
    const angle = Math.atan2(height * sy, width * sx)

    const dx = (negX ? width : 0)
    const dy = (negY ? height : 0)
    return [dx, dy, angle]
}

function getArcRadius(width: number, height: number) {
    const length = Math.sqrt(width ** 2 + height ** 2)
    const rad = Math.min(10, length / 4)
    return [rad, length]
}

/** Returns the straight line length between bracket arcs. */
function getSpanLength(width: number, height: number) {
    const [rad, length] = getArcRadius(width, height)
    const span = (length - 4 * rad) / 2
    return [rad, span, length]
}

/** Returns padding to account for the bracket thickness. */
function getBracketPadding(width: number, height: number) {
    const [rad] = getArcRadius(width, height)
    return STROKE + rad * 2
}

/** Returns the length of one bracket length including bracket arcs. */
function getBracketLength(width: number, height: number) {
    const [rad, span] = getSpanLength(width, height)
    return span + Math.PI * rad
}
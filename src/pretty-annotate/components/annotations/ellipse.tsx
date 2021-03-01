import { h } from 'preact';
import { animated } from 'react-spring';
import { useFillOpacity } from '../../hooks/use-styles';
import useNiceDashLength from '../../hooks/use-dash';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Bounds, Shape, ShapeStyle } from '../../misc/types';
import { SvgBoxContainer } from './box';

type EllipseProps = Annotation<Shape.Ellipse>

/** Returns an ellipse where the ellipse contains the selected box.
 * This makes it easier for a user to annotate content without having to adjust the size afterwards.
 */
export default function Ellipse(props: EllipseProps) {
    return props.shapeStyle === ShapeStyle.OutlineDashed ? <EllipseDashed {...props} /> : <EllipseSolid {...props} />
}

function EllipseSolid(props: EllipseProps) {
    const fillOpacity = useFillOpacity(props.shapeStyle)
    const ellipseProps = getEllipseProps(props)
    return <SvgBoxContainer {...props}>
        <ellipse {...ellipseProps}
            fill={fillOpacity ? "currentColor" : "none"} opacity={fillOpacity}
            stroke="currentColor" strokeWidth={STROKE} />
    </SvgBoxContainer>
}

function EllipseDashed(props: EllipseProps) {
    const ellipseProps = getEllipseProps(props)

    const circumference = calcEllipseCircumference(props) || 0
    const [dashArray] = useNiceDashLength(circumference, DASH, { evenCount: true, shortCorners: true })

    return <SvgBoxContainer {...props}>
        <animated.ellipse {...ellipseProps} fill="none" stroke="currentColor"
            strokeLinecap="round" strokeDasharray={dashArray} strokeWidth={STROKE} />
    </SvgBoxContainer>
}

/** Uses the Ramanujan approximation formula.
 * @see https://en.wikipedia.org/wiki/Ellipse#Circumference
 */
function calcEllipseCircumference({ width: a, height: b }: EllipseProps) {
    return Math.PI * (3 * (a + b) - Math.sqrt(10 * a * b + 3 * (a ** 2 + b ** 2)))
}

/** Maps the selected box to svg ellipse props which are relative to the centre point. */
function getEllipseProps(props: EllipseProps): { cx: number, cy: number, rx: number, ry: number } {
    const { width, height } = props
    const strokeMargin = STROKE / 2
    const x = strokeMargin + width / 2, y = strokeMargin + height / 2
    return { cx: x, cy: y, rx: width / 2, ry: height / 2 }
}

/** Returns ellipse bounds so that the ellipse contains the selected bounds.
 * This makes it easier for a user to annotate content without having to adjust the size afterwards.
 * In the alt case the bounds contains the ellipse like in other programs.
 *
 * The calculation works by:
 * - Solving the ellipse equation where x^2 / a^2 + y^2 / b^2 = 1 and a/b = width/height
 * - Assumes the bounds corners map to coordinates on the new ellipse
 *
 * @see https://en.wikipedia.org/wiki/Ellipse
 */
export function getEllipseBounds(bounds: Bounds, useAlt: boolean) {
    // Treat the case where the bounds contains the ellipse as the alt state
    if (useAlt) return bounds

    // Expand the bounds so the ellipse contains the given bounds
    const { width: w, height: h, left: l, top: t, ...rest } = bounds
    const x = w / 2, y = h / 2 // Define the coordinate pair on the new ellipse assuming the centre is at (0, 0)
    const b = w < 0.05 ? 0 : Math.sqrt(h ** 2 * x ** 2 / w ** 2 + y ** 2)
    const a = h < 0.05 ? 0 : w * b / h // Assume a/b = width/height
    const dx = x - a, dy = y - b // Translate the ellipse to the real position
    return { ...rest, left: l + dx, top: t + dy, width: 2 * a, height: 2 * b }
}

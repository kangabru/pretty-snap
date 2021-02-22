import { h } from 'preact';
import { animated } from 'react-spring';
import { useNiceDashLengthEllipse } from '../../hooks/use-dash';
import { DASH, STROKE } from '../../misc/constants';
import { Annotation, Shape } from '../../misc/types';
import { SvgBoxContainer } from './box';

type EllipseProps = Annotation<Shape.Ellipse>

/** Returns an ellipse where the ellipse contains the selected box.
 * This makes it easier for a user to annotate content without having to adjust the size afterwards.
 */
export default function OuterEllipse(props: EllipseProps) {
    return <InnerEllipse {...getOuterEllipseProps(props)} />
}

/** Returns an ellipse where the ellipse is contained within the selected box. */
export function InnerEllipse(props: EllipseProps) {
    return props.style.dashed ? <EllipseDashed {...props} /> : <EllipseSolid {...props} />
}

function EllipseSolid(props: EllipseProps) {
    const ellipseProps = getEllipseProps(props)
    return <SvgBoxContainer {...props}>
        <ellipse {...ellipseProps} fill="none" stroke="currentColor" strokeWidth={STROKE} />
    </SvgBoxContainer>
}

function EllipseDashed(props: EllipseProps) {
    const ellipseProps = getEllipseProps(props)

    const circumference = calcEllipseCircumference(props) || 0
    const dashArray = useNiceDashLengthEllipse(circumference, DASH)

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

/** Returns new ellipse props so that the ellipse wraps the inner box instead of being contained by it.
 *
 * The calculation works by:
 * - Solving the ellipse equation where x^2 / a^2 + y^2 / b^2 = 1
 * - Assumes the original width / height map to x, y coordinates on the new ellipse
 * - The ellipse a/b ratio equals width/height
 *
 * @see https://en.wikipedia.org/wiki/Ellipse
 */
function getOuterEllipseProps(props: EllipseProps): EllipseProps {
    const { width: w, height: h, left: l, top: t, ...rest } = props
    const x = w / 2, y = h / 2 // Define the coordinate pair on the new ellipse assuming the centre is at (0, 0)
    const b = w < 0.05 ? 0 : Math.sqrt(h ** 2 * x ** 2 / w ** 2 + y ** 2)
    const a = h < 0.05 ? 0 : w * b / h // Assume a/b = width/height
    const dx = x - a, dy = y - b // Translate the ellipse to the real position
    return { ...rest, left: l + dx, top: t + dy, width: 2 * a, height: 2 * b }
}

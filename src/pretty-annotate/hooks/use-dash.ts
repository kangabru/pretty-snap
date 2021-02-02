import { useSpring } from 'react-spring';

/** It takes a target dash length and gap and adjusts them so the dash starts and ends perfect for the given line length.
 * @argument lineLength: The total length of the line
 * @argument dashLengthTarget: The length of a dash and/or gap (not their sum)
 * @returns [dash array string, dash offset] as react spring interpolated values
 */
export default function useNiceDashLength(lineLength: number, dashLengthTarget: number, shortCorners?: boolean) {

    // Round down the dash length so they fit the line length perfectly
    // Short corners:
    //  - The line starts and ends with a half dash
    //  - A whole number of dash + gap lengths is required
    // Long corners:
    //  - The line starts and ends with a full dash
    //  - An whole number of dash + gap lengths PLUS one dash is required (hence the 0.5)
    const lengthTarget = 2 * dashLengthTarget // dash + gap
    const dashes = Math.floor(lineLength / lengthTarget) + (shortCorners ? 0 : 0.5)
    const length = lineLength / Math.max(0.1, dashes) // don't divide by 0
    const dashLength = dashLengthTarget / lengthTarget * length

    // Proxy the values through react spring for tasty animations
    const { dash, offset } = useSpring<{ dash: number, offset: number }>({
        dash: dashLength,
        offset: (shortCorners ? dashLength / 2 : 0),
    })

    // svg 'stroke-dasharray' format
    return [dash.interpolate(dash => `${dash},${dash}`), offset]
}
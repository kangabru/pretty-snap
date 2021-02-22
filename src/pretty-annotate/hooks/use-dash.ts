import { useSpring } from 'react-spring';

export type DashStyle = {
    shortCorners?: boolean,
    evenCount?: boolean, // undefined -> no change, false = odd count, true = even count
}

/** It takes a target dash length and gap and adjusts them so the dash starts and ends perfect for the given line length.
 * @argument lineLength: The total length of the line
 * @argument targetDashLength: The length of a dash and/or gap (not their sum)
 * @returns [dash array string, dash offset] as react spring interpolated values
 */
export default function useNiceDashLength(lineLength: number, targetDashLength: number, style?: DashStyle) {

    // Round down the dash length so they fit the line length perfectly
    const dashes = getDashCount(lineLength, 2 * targetDashLength, style)  // dash + gap
    const length = lineLength / Math.max(0.1, dashes) // don't divide by 0

    // Proxy the values through react spring for tasty animations
    const { dash, offset } = useSpring<{ dash: number, offset: number }>({
        dash: length / 2,
        offset: (style?.shortCorners ? length / 4 : 0),
    })

    return [dash, offset]
}

function getDashCount(lineLength: number, lengthTarget: number, options?: DashStyle) {
    let dashes = Math.floor(lineLength / lengthTarget)

    // Short corners:
    //  - The line starts and ends with a half dash
    //  - A whole number of dash + gap lengths is required
    // Long corners:
    //  - The line starts and ends with a full dash
    //  - An whole number of dash + gap lengths PLUS one dash is required (hence the 0.5)
    if (!options?.shortCorners) dashes += 0.5

    // Round the number of dashes if the count option is true (even) or false (odd). Undefined values are ignored.
    if (options?.evenCount)
        dashes += (dashes % 2 == 0 ? 0 : 1)
    else if (options?.evenCount === false) // add count
        dashes += (dashes % 2 == 0 ? 1 : 0)

    return dashes
}

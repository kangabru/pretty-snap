import { h } from 'preact';
import { animated, interpolate, useSpring } from 'react-spring';
import { join } from '../../../common/misc/utils';
import { DimensionsNeg, Dragger } from './resizer';

export default function Editor() {
    const isAdding = true
    return <section class={join("relative", isAdding && "cursor-crosshair")}>
        <TempDevImage />
        <Dragger onComplete={console.log} render={dims => <DashedRect {...dims} />} />
    </section>
}

function DashedRect({ left, top, width, height }: DimensionsNeg) {
    const strokeWidth = 8, strokeMargin = strokeWidth / 2

    const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth }
    const [dashArrayW, dashOffsetW] = useNiceDashLength(width, 16, true)
    const [dashArrayH, dashOffsetH] = useNiceDashLength(height, 16, true)

    // Adjust the bounds by half the stroke width so the svg doesn't clip off the edges
    const x1 = strokeMargin, y1 = strokeMargin
    const x2 = x1 + width, y2 = y1 + height

    return <div class="absolute" style={{ left: left - strokeMargin, top: top - strokeMargin }}>
        <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
            <animated.line x1={x1} y1={y1} x2={x2} y2={y1} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} />
            <animated.line x1={x1} y1={y2} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} />
            <animated.line x1={x1} y1={y1} x2={x1} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} />
            <animated.line x1={x2} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} />
        </svg>
    </div>
}

/** It takes a target dash length and gap and adjusts them so the dash starts and ends perfect for the given line length.
 * @argument lineLength: The total length of the line
 * @argument dashLengthTarget: The length of a dash and/or gap (not their sum)
 * @returns [dash array string, dash offset] as react spring interpolated values
 */
function useNiceDashLength(lineLength: number, dashLengthTarget: number, shortCorners?: boolean) {

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

    // Proxy the values through react spring for tasty animations
    const { dash, gap } = useSpring<{ dash: number, gap: number }>({
        dash: dashLengthTarget / lengthTarget * length,
        gap: dashLengthTarget / lengthTarget * length,
    })

    return [
        interpolate([dash, gap] as any, (dash, gap) => `${dash},${gap}`), // svg 'stroke-dasharray' format
        shortCorners ? dash.interpolate(x => x / 2) : 0,
    ]
}

function TempDevImage() {
    return <div class="bg-white" style={{ width: 800 }}>
        <div class="flex items-center justify-end p-3 bg-gray-700">
            <div class="flex space-x-4">
                <div class="bg-blue-300   w-6 h-6 rounded-full"></div>
                <div class="bg-red-300    w-6 h-6 rounded-full"></div>
                <div class="bg-yellow-300 w-6 h-6 rounded-full"></div>
            </div>
        </div>

        <div class="flex">
            <div class="hidden sm:block w-1/5 bg-gray-100 p-4 space-y-2">
                <div class="bg-gray-300 w-4/6 h-4 rounded-full"></div>
                <div class="bg-gray-300 w-2/6 h-4 rounded-full"></div>
                <div class="bg-gray-300 w-6/6 h-4 rounded-full"></div>
                <div class="h-2"></div>
                <div class="bg-gray-300 w-3/6 h-4 rounded-full"></div>
                <div class="bg-gray-300 w-5/6 h-4 rounded-full"></div>
                <div class="bg-gray-300 w-2/6 h-4 rounded-full"></div>
            </div>

            <div class="flex-1 space-y-4 p-8">
                <div class="bg-gray-200 w-5/6 h-6 rounded-full"></div>
                <div class="bg-gray-200 w-3/6 h-6 rounded-full"></div>
                <div class="bg-gray-200 w-1/6 h-6 rounded-full"></div>
                <div class="h-4"></div>
                <div class="bg-gray-200 w-3/6 h-6 rounded-full"></div>
                <div class="bg-gray-200 w-4/6 h-6 rounded-full"></div>
                <div class="bg-gray-200 w-1/6 h-6 rounded-full"></div>
                <div class="h-4"></div>
                <div class="bg-gray-200 w-1/6 h-6 rounded-full"></div>
                <div class="bg-gray-200 w-5/6 h-6 rounded-full"></div>
                <div class="bg-gray-200 w-3/6 h-6 rounded-full"></div>
            </div>
        </div>
    </div>
}
import { h } from 'preact';
import { animated, interpolate, useSpring } from 'react-spring';
import { join } from '../../../common/misc/utils';
import { Dragger } from './resizer';

export default function Editor() {
    const isAdding = true
    return <section class={join(isAdding && "cursor-move relative")}>
        <TempDevImage />
        <Dragger onComplete={console.log} render={({ left, top, width, height, }) => {
            const strokeWidth = 8, strokeMargin = strokeWidth / 2

            const dashProps = { stroke: "currentColor", strokeLinecap: "round" as any, strokeWidth }
            const [dashArrayW, dashOffsetW] = useNiceDashLength(width, 16, 16, true)
            const [dashArrayH, dashOffsetH] = useNiceDashLength(height, 16, 16, true)

            const x1 = strokeMargin, y1 = strokeMargin
            const x2 = x1 + width, y2 = y1 + height

            return <div class="absolute" style={{ left, top }}>
                <svg fill="currentColor" width={width + strokeWidth} height={height + strokeWidth} xmlns="http://www.w3.org/2000/svg">
                    <animated.line x1={x1} y1={y1} x2={x2} y2={y1} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} />
                    <animated.line x1={x1} y1={y2} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayW} strokeDashoffset={dashOffsetW} />
                    <animated.line x1={x1} y1={y1} x2={x1} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} />
                    <animated.line x1={x2} y1={y1} x2={x2} y2={y2} {...dashProps} strokeDasharray={dashArrayH} strokeDashoffset={dashOffsetH} />
                </svg>
            </div>
        }} />
    </section>
}

function useNiceDashLength(lineLength: number, dashTarget: number, gapTarget: number, shortCorners?: boolean) {
    const lengthTarget = dashTarget + gapTarget
    const dashes = Math.floor(lineLength / lengthTarget) + (shortCorners ? 0 : 0.5)
    const length = lineLength / Math.max(0.1, dashes)

    const { dash, gap } = useSpring<{ dash: number, gap: number }>({
        dash: dashTarget / lengthTarget * length,
        gap: gapTarget / lengthTarget * length,
    })

    return [
        interpolate([dash, gap] as any, (dash, gap) => `${dash},${gap}`),
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
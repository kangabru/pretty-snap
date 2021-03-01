import { useState } from "preact/hooks"
import { useWindowListener } from "./use-misc"

/** Thise sizes match the default Tailwind config screen sizes.
 * https://github.com/tailwindlabs/tailwindcss/blob/ea3bd209141ace8f57f38d3702e5177a9492f55e/stubs/defaultConfig.stub.js#L8-L13
 */
export enum ScreenWidth {
    sm = 640,
    md = 768,
    lg = 1024,
    xl = 1280,
    '2xl' = 1536,
}

/** Returns the current width of the window */
export function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth)
    useWindowListener('resize', () => setWidth(window.innerWidth))
    return width
}

export function useWindowSmallerThan(target: ScreenWidth) {
    const width = useWindowWidth()
    return width < target
}

export function useWindowLargerThan(target: ScreenWidth) {
    const width = useWindowWidth()
    return width > target
}
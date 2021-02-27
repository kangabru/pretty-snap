import { h } from 'preact';
import { Ref, useRef } from 'preact/hooks';
import { useLayoutEffect, useState } from 'react';
import { animated, AnimatedValue, ForwardedProps, useTransition } from 'react-spring';
import { Children, CSSProps } from '../../../common/misc/types';
import useAnnotateStore from '../../stores/annotation';

export function ButtonRowWithAnim({ children, style }: Children & CSSProps) {
    const rowTransition = useTransition(true, null, {
        from: { transform: 'scale(0)', opacity: 1 },
        enter: { transform: 'scale(1)' },
    })
    return rowTransition.map(({ item, props }) => item && <animated.div style={{ ...props, ...style as any }}
        className="flex space-x-3 p-3 rounded-lg bg-white shadow-md">
        {children}
    </animated.div>) as any
}

export function AnnotateButtonSvg({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <AnnotateButton {...props}>
        <svg class="w-8 h-8 transform" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </AnnotateButton>
}

export function AnnotateButton({ children, style, ...props }: AnimatedValue<ForwardedProps<any>>) {
    const [ref, ringColor] = useRingColourStyle()
    return <animated.button ref={ref} {...props} style={{ ...style, [VAR_RING_COLOR]: ringColor }}
        className="bg-gray-100 w-12 h-12 rounded-md grid place-items-center outline-ring">
        {children}
    </animated.button>
}

/** Returns a ring colour matching the current style colour.
 * @note The ref element should used Tailwind ring classes like 'ring-4' and 'ring-opacity-40'
 */
export function useRingColourStyle(): [Ref<any>, string] {
    const color = useAnnotateStore(s => s.style.color.color)
    return useRingColourWithOpacity(color)
}

/** Returns a ring colour with the correct ring opacity defined via Tailwind ring classes. */
export function useRingColourWithOpacity(color: string): [Ref<any>, string] {
    const ref = useRef<any>()
    const [ringColor, setRingColor] = useState(color)

    // Use the layout effect because we need the ref value on first render
    useLayoutEffect(() => {
        const rgb = hexToRgb(color)
        if (rgb == null) setRingColor(color)
        else {
            const opacity = getRingOpacity(ref.current)
            const [r, g, b] = rgb
            setRingColor(`rgba(${r},${g},${b},${opacity})`)
        }
    }, [color])

    return [ref, ringColor]
}

export const VAR_RING_COLOR = '--tw-ring-color'
const VAR_RING_OPACITY = '--tw-ring-opacity'

/** Returns the Tailwind CSS defined ring opacity applicable to the given element. */
function getRingOpacity(element: HTMLElement | undefined): number {
    if (!element) return 1
    const val = parseFloat(getComputedStyle(element).getPropertyValue(VAR_RING_OPACITY))
    return isNaN(val) ? 1 : val
}

/** Returns the RGB values of the given hex value or null if the value doesn't start with '#' */
function hexToRgb(hex: string): null | [number, number, number] {
    if (!hex.startsWith('#')) return null;

    let r: string, g: string, b: string
    if (hex.length == 4) { // 3 digit
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    }
    else { // 6 digit
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }

    return [+r, +g, +b]
}
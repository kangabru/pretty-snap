import { Ref, useRef } from 'preact/hooks';
import { useLayoutEffect, useState } from 'react';
import { colors, SHAPE_TRANSPARENT_OPACITY } from '../misc/constants';
import { Shape, ShapeStyle, StyleOptions, SupportedStyle, supportedStyles } from "../misc/types";
import useAnnotateStore from "../stores/annotation";
import useEditingAnnotation from './use-annotation';

/** Returns the current annotation's style if an annotation is being editing otherwise the global style. */
export function useCurrentStyle() {
    const globalStyle = useAnnotateStore(s => s.style)
    const editAnnotation = useEditingAnnotation()[1]
    return editAnnotation ? editAnnotation : globalStyle
}

/** Returns the current annotation's style and setter functions if an annotation is being editing otherwise the global style and setter functions. */
export function useSetStyle(): [StyleOptions, (_: Partial<StyleOptions>) => void] {
    const style = useCurrentStyle()
    const saveStyle = useAnnotateStore(s => s.saveStyle)
    return [style, saveStyle]
}

/** Returns the selected annotation's shape if an annotation is being edited otherwise returns the global shape. */
export function useCurrentShape(): [Shape, SupportedStyle] {
    const shape = useCurrentStyle().shape
    const supportedStyle = supportedStyles[shape] ?? {} as SupportedStyle
    return [shape, supportedStyle]
}

/** Returns the fill opacity (value from 0 to 1) for the given shape style or undefined if no fill should be applied. */
export function useFillOpacity(style: ShapeStyle): number | undefined {
    switch (style) {
        case ShapeStyle.Solid:
            return 1
        case ShapeStyle.Transparent:
            return SHAPE_TRANSPARENT_OPACITY
        default:
            return undefined
    }
}

/** Returns a ring colour matching the current style colour.
 * @note The ref element should used Tailwind ring classes like 'ring-4' and 'ring-opacity-40'
 */
export function useRingColourStyle(): [Ref<any>, string] {
    const { color, useDarkText } = useAnnotateStore(s => s.style.color)
    return useRingColourWithOpacity(useDarkText ? colors.dark : color)
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
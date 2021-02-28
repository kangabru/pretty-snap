import { Ref } from 'preact';
import { useMemo } from 'preact/hooks';
import { CSSProperties } from 'react';
import { useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import useStoredSettings, { SettingRoundedImageCorners, } from '../../../common/hooks/use-stored-settings';
import { ForegroundImage } from '../../../common/misc/types';
import { srcToUrl, srcToUrlSvg } from '../../../common/misc/utils';
import { BORDER_RADIUS } from '../../misc/constants';
import { Position, Settings } from '../../misc/types';
import { getImageSrc } from '../../misc/utils';
import useOptionsStore from '../../stores/options';

export const CLASSES_OUTER_IMAGE = "bg-gray-200 bg-cover bg-center"
export const CLASSES_OUTER_PATTERN = "relative bg-repeat"
export const CLASSES_INNER = "relative z-10 shadow-xl transition"

type CompositionStyles = { inner?: CSSProperties, outer?: CSSProperties }

/** This hook handles the composition styling based on the given options the user has selected.
 * It handles styles like the image position, the padding, and general container styles.
 *
 * We also need to style 2 components equally:
 * - The visible preview element that the user can see and interact with
 * - A hidden element used to render the final image
 *
 * These elements need similar but slightly different styles that that viewing and rendering behave as expected.
 */
export function useCompositionStyles(): [Ref<HTMLElement>, CompositionStyles, CompositionStyles] {
    const settings = useOptionsStore() // Not this refreshes on every external option update
    const [contRefScreen, { width }] = useMeasure()
    const stylesScreen = useStylesPreview(settings, width)
    const stylesRender = useStylesRender(settings, width)
    return [contRefScreen, stylesScreen, stylesRender]
}

/** Like useCompositionStyles but all properties are animated using react-spring. Must be rendered with animated components. */
export function useAnimatedCompositionStyles(): [Ref<HTMLElement>, CompositionStyles, CompositionStyles] {
    const [contRefScreen, stylesScreen, stylesRender] = useCompositionStyles()

    const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius, ...restStylesScreenInner } = stylesScreen.inner as CSSProperties
    const animStylesScreenInner = useSpring({ borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius })

    const { backgroundColor, paddingLeft, paddingTop, paddingRight, paddingBottom, ...restStylesScreenOuter } = stylesScreen.outer as CSSProperties
    const animStylesScreenOuter = useSpring({ backgroundColor, paddingLeft, paddingTop, paddingRight, paddingBottom })

    const stylesScreenAnim = {
        inner: { ...animStylesScreenInner, ...restStylesScreenInner },
        outer: { ...animStylesScreenOuter, ...restStylesScreenOuter },
    }

    return [contRefScreen, stylesScreenAnim, stylesRender]
}

/** Returns styles for the compositor visible on screen.
 * These styles are made to render the iamge on screen as it would look when rendered.
 */
function useStylesPreview(settings: Settings, windowWidth: number): CompositionStyles {
    const { paddingPerc, position, foreground } = settings

    const paddingRaw = getPadding(paddingPerc, foreground)
    const [width,] = getForegroundImgSize(foreground)

    // Padding is a function of image size which is scaled down when viewed on screen so here we scale down the padding too.
    const scaleDown = width ? windowWidth / (width + 2 * paddingRaw) : 1
    const padding = width
        ? scaleDown * paddingRaw // paddingRaw accounts for both width and height of the actual image
        : windowWidth / (2 + 100 / paddingPerc) // just use the screen width until an image is chosen

    const bgStylesOuter = getBackgroundStyles(settings, 1) // Don't scale patterns
    const [posStylesInner, posStylesOuter] = usePositionStyles(padding, position, 1) // Don't scale border radius

    return {
        inner: posStylesInner,
        outer: { ...posStylesOuter, ...bgStylesOuter },
    }
}

/** Returns styles used to export the final image.
 * This is done by defining styles on a hidden image that the dom-to-image library renders.
 */
function useStylesRender(settings: Settings, windowWidth: number): CompositionStyles {
    const { paddingPerc, position, foreground } = settings

    const padding = getPadding(paddingPerc, foreground)
    const [width, height] = getForegroundImgSize(foreground)
    const [widthBg, heightBg] = getSizeBackground(settings)

    // Scale some values up so they render as they appear on screen (border radius and SVG pattern size)
    const scaleUp = (width + 2 * padding) / windowWidth

    const bgStylesOuter = getBackgroundStyles(settings, scaleUp)
    const [posStylesInner, posStylesOuter] = usePositionStyles(padding, position, scaleUp)

    // Explicitly set width and height so the html to image libary renders correctly
    return {
        inner: { ...posStylesInner, width, height },
        outer: { ...posStylesOuter, width: widthBg, height: heightBg, ...bgStylesOuter },
    }
}

/** Returns the padding as a function of the image size.
 * @param paddingPerc - The whole number percentage of the image width and height used to calculate the padding.
 */
function getPadding(paddingPerc: number, foreground: ForegroundImage | undefined) {
    const [width, height] = getForegroundImgSize(foreground)
    return Math.min(width, height) * paddingPerc / 100
}

/** Returns the size of the foreground image.
 * @returns [width, height] of the foreground image for [0, 0] if no foreground is selected. */
function getForegroundImgSize(foreground: ForegroundImage | undefined) {
    return [foreground?.width ?? 0, foreground?.height ?? 0]
}

/** A hook that returns the size of the background image accounting for positional padding.
 * @returns [width, height] of the background image. */
export function useGetSizeBackground(): [number, number] {
    const position = useOptionsStore(s => s.position)
    const foreground = useOptionsStore(s => s.foreground)
    const paddingPerc = useOptionsStore(s => s.paddingPerc)

    return useMemo(() => {
        return getSizeBackground({ position, foreground, paddingPerc })
    }, [position, foreground, paddingPerc])
}

/** Returns the size of the background image accounting for positional padding.
 * @returns [width, height] of the background image. */
export function getSizeBackground({ paddingPerc, position, foreground }:
    Pick<Settings, 'paddingPerc' | 'position' | 'foreground'>): [number, number] {
    const padding = getPadding(paddingPerc, foreground)

    const [width, height] = getForegroundImgSize(foreground)
    const shortX = position == Position.Left || position == Position.Right
    const shortY = position == Position.Top || position == Position.Bottom

    return [width + padding * (shortX ? 1 : 2), height + padding * (shortY ? 1 : 2)]
}

/** Returns styles for the background properties.
 * @param bgSizeScale - Scales the background svg pattern if a pattern is selected.
 */
function getBackgroundStyles({ backgroundImage, backgroundPattern }: Settings, bgSizeScale: number): CSSProperties {
    const backgroundColor = backgroundPattern ? backgroundPattern.bgColour : 'white'
    const pattern = backgroundPattern?.getSrc && backgroundPattern?.getSrc(backgroundPattern)
    return {
        backgroundColor,
        backgroundSize: pattern && `${pattern.w * bgSizeScale}px ${pattern.h * bgSizeScale}px`,
        backgroundPosition: "center",
        backgroundImage: pattern ? srcToUrlSvg(pattern.url) : srcToUrl(getImageSrc(backgroundImage)),
    }
}

/** Returns styles for fore and background images to position the foreground according to the user selected options.
 * @param scale - Scales the border radius of the inner image
 */
function usePositionStyles(padding: number, position: Position, scale: number): [CSSProperties, CSSProperties] {
    const useImageBorderRadius = useStoredSettings(s => s[SettingRoundedImageCorners])
    const rad = useImageBorderRadius ? BORDER_RADIUS * scale : 0

    const stylesForeground: Partial<CSSProperties> = {
        borderTopLeftRadius: rad, borderTopRightRadius: rad,
        borderBottomLeftRadius: rad, borderBottomRightRadius: rad,
    }
    const stylesBackground: Partial<CSSProperties> = {
        paddingLeft: padding, paddingTop: padding,
        paddingRight: padding, paddingBottom: padding,
    }

    switch (position) {
        case Position.Left:
            stylesBackground.paddingLeft = 0
            stylesForeground.borderTopLeftRadius = 0
            stylesForeground.borderBottomLeftRadius = 0
            break;
        case Position.Top:
            stylesBackground.paddingTop = 0
            stylesForeground.borderTopLeftRadius = 0
            stylesForeground.borderTopRightRadius = 0
            break;
        case Position.Right:
            stylesBackground.paddingRight = 0
            stylesForeground.borderTopRightRadius = 0
            stylesForeground.borderBottomRightRadius = 0
            break;
        case Position.Bottom:
            stylesBackground.paddingBottom = 0
            stylesForeground.borderBottomLeftRadius = 0
            stylesForeground.borderBottomRightRadius = 0
            break;
    }

    return [stylesForeground, stylesBackground]
}
import { CSSProperties } from 'react';
import { useSpring } from 'react-spring';
import { INNER_BORDER_RADIUS } from '../../../common/constants';
import useStoredSettings, { SettingRoundedImageCorners } from '../../../common/hooks/use-stored-settings';
import { srcToUrl, srcToUrlSvg } from '../../../common/misc/utils';
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
export function useCompositionStyles(width: number, height: number): CompositionStyles {
    const settings = useOptionsStore() // Not this refreshes on every external option update
    return useStylesPreview(settings, width, height)
}

/** Like useCompositionStyles but all properties are animated using react-spring. Must be rendered with animated components. */
export function useAnimatedCompositionStyles(styles: CompositionStyles): CompositionStyles {
    const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius, ...restStylesScreenInner } = styles.inner as CSSProperties
    const animStylesScreenInner = useSpring({ borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius })

    const { backgroundColor, paddingLeft, paddingTop, paddingRight, paddingBottom, ...restStylesScreenOuter } = styles.outer as CSSProperties
    const animStylesScreenOuter = useSpring({ backgroundColor, paddingLeft, paddingTop, paddingRight, paddingBottom })

    return {
        inner: { ...animStylesScreenInner, ...restStylesScreenInner },
        outer: { ...animStylesScreenOuter, ...restStylesScreenOuter },
    }
}

/** Returns styles for the compositor visible on screen.
 * These styles are made to render the iamge on screen as it would look when rendered.
 */
function useStylesPreview(settings: Settings, width: number, height: number): CompositionStyles {
    const { paddingPerc, position } = settings

    const padding = getPadding(width, height, paddingPerc)

    const bgStylesOuter = getBackgroundStyles(settings)
    const [posStylesInner, posStylesOuter] = usePositionStyles(padding, position)

    return {
        inner: posStylesInner,
        outer: { ...posStylesOuter, ...bgStylesOuter },
    }
}

function getPadding(width: number, height: number, paddingPerc: number) {
    return Math.min(width, height) * paddingPerc / 100
}

/** A hook that returns the size of the background image accounting for positional padding.
 * @returns [width, height] of the background image. */
export function useGetSizeBackground(): [number, number] {
    const position = useOptionsStore(s => s.position)
    const foreground = useOptionsStore(s => s.foreground)
    const paddingPerc = useOptionsStore(s => s.paddingPerc)

    const width = foreground?.width ?? 0, height = foreground?.height ?? 0
    return getSizeBackground(width, height, position, paddingPerc)
}

/** Returns the size of the background image accounting for positional padding.
 * @returns [width, height] of the background image. */
export function getSizeBackground(width: number, height: number, position: number, paddingPerc: number): [number, number] {
    const padding = getPadding(width, height, paddingPerc)

    const shortX = position == Position.Left || position == Position.Right
    const shortY = position == Position.Top || position == Position.Bottom

    return [width + padding * (shortX ? 1 : 2), height + padding * (shortY ? 1 : 2)]
}

/** Returns styles for the background properties.
 * @param bgSizeScale - Scales the background svg pattern if a pattern is selected.
 */
function getBackgroundStyles({ backgroundImage, backgroundPattern }: Settings, bgSizeScale = 1): CSSProperties {
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
function usePositionStyles(padding: number, position: Position): [CSSProperties, CSSProperties] {
    const useImageBorderRadius = useStoredSettings(s => s[SettingRoundedImageCorners])
    const rad = useImageBorderRadius ? INNER_BORDER_RADIUS : 0

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
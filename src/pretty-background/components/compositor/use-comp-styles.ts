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

/** Wraps 'useCompositionStyles' but all properties are animated with react-spring. Must be used with animated components. */
export function useAnimatedCompositionStyles(styles: CompositionStyles): CompositionStyles {
    const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius, ...restStylesClientInner } = styles.inner as CSSProperties
    const animStylesClientInner = useSpring({ borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius })

    const { backgroundColor, paddingLeft, paddingTop, paddingRight, paddingBottom, ...restStylesClientOuter } = styles.outer as CSSProperties
    const animStylesClientOuter = useSpring({ backgroundColor, paddingLeft, paddingTop, paddingRight, paddingBottom })

    return {
        inner: { ...animStylesClientInner, ...restStylesClientInner },
        outer: { ...animStylesClientOuter, ...restStylesClientOuter },
    }
}

/** Handles the composition styling based on the given options the user has selected.
 * It handles styles like the image position, the padding, and general container styles.
 *
 * Two styles are returned:
 * - The 'inner' container where the imported image is placed
 * - The 'outer' container which the background is placed
 */
export function useCompositionStyles(width: number, height: number): CompositionStyles {
    const settings = useOptionsStore() // Note this refreshes on every external option update
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
export function useBackgroundSize(): [number, number] {
    const position = useOptionsStore(s => s.position)
    const foreground = useOptionsStore(s => s.foreground)
    const paddingPerc = useOptionsStore(s => s.paddingPerc)

    const width = foreground?.width ?? 0, height = foreground?.height ?? 0
    return getBackgroundSize(width, height, position, paddingPerc)
}

/** Returns the size of the background image accounting for positional padding.
 * @returns [width, height] of the background image. */
export function getBackgroundSize(width: number, height: number, position: number, paddingPerc: number): [number, number] {
    const padding = getPadding(width, height, paddingPerc)

    const shortX = position == Position.Left || position == Position.Right
    const shortY = position == Position.Top || position == Position.Bottom

    return [width + padding * (shortX ? 1 : 2), height + padding * (shortY ? 1 : 2)]
}

/** Returns styles for the background properties. */
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

/** Returns styles for fore and background images to position the foreground according to the selected options. */
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
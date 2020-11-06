import { Ref } from 'preact';
import { CSSProperties } from 'react';
import useMeasure from 'react-use-measure';
import { MAX_SIZE } from '../../constants';
import { Foreground, Position, Settings } from '../../types';
import useOptionsStore from '../stores/options';
import { srcToUrl } from '../utils';

export const CLASSES_OUTER = "bg-gray-200 bg-cover bg-center"
export const CLASSES_INNER = "rounded-lg shadow-xl"

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
export default function useCompositionStyles(): [Ref<HTMLElement>, CompositionStyles, CompositionStyles] {
    const settings = useOptionsStore() // Not this refreshes on every external option update
    const [contRefScreen, screen] = useStylesPreview(settings)
    const render = useStylesRender(settings)
    return [contRefScreen, screen, render]
}

/** Returns styles for the compositor visible on screen. */
function useStylesPreview(settings: Settings): [Ref<HTMLElement>, CompositionStyles] {
    const { padding, position, background, foreground } = settings

    // Uses can upload image larger than the screen size but the padding will look tiny when rendered.
    // Here we adjust the padding so the proportion is the same in the rendered image.
    // We must measure the container width to achieve this.
    const [refPreviewContainer, { width }] = useMeasure()
    const [imageWidth,] = getSizeForeground(foreground)
    const paddingScreen = padding * Math.min(1, imageWidth ? width / imageWidth : 1)

    const [posStylesInner, posStylesOuter] = getPositionStyles(paddingScreen, position)

    return [refPreviewContainer, {
        inner: posStylesInner,
        outer: { ...posStylesOuter, backgroundImage: srcToUrl(background.src) },
    }]
}

/** Returns styles used to export the final image. */
function useStylesRender(settings: Settings): CompositionStyles {
    const { padding, position, foreground, background } = settings

    const [width, height] = getSizeForeground(foreground)
    const [widthBg, heightBg] = getSizeBackground(settings)

    const [posStylesInner, posStylesOuter] = getPositionStyles(padding, position)

    return {
        inner: { ...posStylesInner, width, height },
        outer: { ...posStylesOuter, width: widthBg, height: heightBg, backgroundImage: srcToUrl(background.srcExport) },
    }
}

/** Returns the size of the foreground image.
 * @returns [width, height] of the foreground image ofr [0, 0] if no foreground is selected. */
export function getSizeForeground(foreground: Foreground | undefined) {
    if (!(foreground?.width && foreground?.height)) return [0, 0]

    // Scale down large images
    const { width, height } = foreground
    const maxSize = Math.max(width, height)
    const scale = Math.min(1, MAX_SIZE / maxSize)
    return [width * scale, height * scale]
}

/** Returns the size of the background image accounting for positional padding.
 * @returns [width, height] of the background image. */
export function getSizeBackground(settings: Omit<Settings, 'background'>) {
    const { padding, position, foreground } = settings

    const [width, height] = getSizeForeground(foreground)
    const shortX = position == Position.Left || position == Position.Right
    const shortY = position == Position.Top || position == Position.Bottom

    return [width + padding * (shortX ? 1 : 2), height + padding * (shortY ? 1 : 2)]
}

/** Returns styles for fore and background images to position the foreground according to the user selected options. */
function getPositionStyles(padding: number, position: Position): [CSSProperties, CSSProperties] {
    const paddingStr = `${padding}px`

    const stylesForeground: Partial<CSSStyleDeclaration> = {}
    const stylesBackground: Partial<CSSStyleDeclaration> = {
        paddingLeft: paddingStr, paddingTop: paddingStr,
        paddingRight: paddingStr, paddingBottom: paddingStr,
    }

    switch (position) {
        case Position.Left:
            stylesBackground.paddingLeft = '0'
            stylesForeground.borderTopLeftRadius = '0'
            stylesForeground.borderBottomLeftRadius = '0'
            break;
        case Position.Top:
            stylesBackground.paddingTop = '0'
            stylesForeground.borderTopLeftRadius = '0'
            stylesForeground.borderTopRightRadius = '0'
            break;
        case Position.Right:
            stylesBackground.paddingRight = '0'
            stylesForeground.borderTopRightRadius = '0'
            stylesForeground.borderBottomRightRadius = '0'
            break;
        case Position.Bottom:
            stylesBackground.paddingBottom = '0'
            stylesForeground.borderBottomLeftRadius = '0'
            stylesForeground.borderBottomRightRadius = '0'
            break;
    }

    return [stylesForeground as CSSProperties, stylesBackground as CSSProperties]
}
import { Ref } from 'preact';
import { CSSProperties } from 'react';
import useMeasure from 'react-use-measure';
import { Foreground, Position, Settings } from '../../types';
import useOptionsStore from '../stores/options';
import { srcToUrl } from '../utils';

export const CLASSES_OUTER = "bg-gray-200 bg-cover bg-center"
export const CLASSES_INNER = "rounded-lg shadow-xl"

type CompositionStyles = { inner?: CSSProperties, outer?: CSSProperties }

export default function useCompositionStyles(foreground: Foreground | undefined): [Ref<HTMLElement>, CompositionStyles, CompositionStyles] {
    const background = useOptionsStore(s => s.background)
    const padding = useOptionsStore(s => s.padding)
    const position = useOptionsStore(s => s.position)

    const settings: Settings = { background, padding, position, foreground }
    const [contRefScreen, screen] = useStylesScreen(settings)
    const render = useStylesRender(settings)

    return [contRefScreen, screen, render]
}

function useStylesScreen(settings: Settings): [Ref<HTMLElement>, CompositionStyles] {
    const { padding, position, background, foreground } = settings
    const [contRefScreen, { width }] = useMeasure()

    const imageWidth = foreground?.width
    const paddingScreen = padding * Math.min(1, imageWidth ? width / imageWidth : 1)

    const [posStylesInner, posStylesOuter] = getPositionStyles(paddingScreen, position)

    return [contRefScreen, {
        inner: posStylesInner,
        outer: { ...posStylesOuter, backgroundImage: srcToUrl(background.src) },
    }]
}

function useStylesRender(settings: Settings): CompositionStyles {
    const { padding, position, foreground, background } = settings

    const [width, height] = getSizeInner(foreground)
    const [widthPad, heightPad] = getSizeOuter(settings)

    const [posStylesInner, posStylesOuter] = getPositionStyles(padding, position)

    return {
        inner: { ...posStylesInner, width, height },
        outer: { ...posStylesOuter, width: widthPad, height: heightPad, backgroundImage: srcToUrl(background.src) },
    }
}

export function getSizeInner(foreground: Foreground | undefined) {
    return [foreground?.width ?? 0, foreground?.height ?? 0]
}

export function getSizeOuter(settings: Omit<Settings, 'background'>) {
    const { padding, position, foreground } = settings

    const [width, height] = getSizeInner(foreground)
    const shortX = position == Position.Left || position == Position.Right
    const shortY = position == Position.Top || position == Position.Bottom

    return [width + padding * (shortX ? 1 : 2), height + padding * (shortY ? 1 : 2)]
}

function getPositionStyles(padding: number, position: Position): [CSSProperties, CSSProperties] {
    const paddingStr = `${padding}px`

    const stylesInner: Partial<CSSStyleDeclaration> = {}
    const stylesOuter: Partial<CSSStyleDeclaration> = {
        paddingLeft: paddingStr, paddingTop: paddingStr,
        paddingRight: paddingStr, paddingBottom: paddingStr,
    }

    switch (position) {
        case Position.Left:
            stylesOuter.paddingLeft = '0'
            stylesInner.borderTopLeftRadius = '0'
            stylesInner.borderBottomLeftRadius = '0'
            break;
        case Position.Top:
            stylesOuter.paddingTop = '0'
            stylesInner.borderTopLeftRadius = '0'
            stylesInner.borderTopRightRadius = '0'
            break;
        case Position.Right:
            stylesOuter.paddingRight = '0'
            stylesInner.borderTopRightRadius = '0'
            stylesInner.borderBottomRightRadius = '0'
            break;
        case Position.Bottom:
            stylesOuter.paddingBottom = '0'
            stylesInner.borderBottomLeftRadius = '0'
            stylesInner.borderBottomRightRadius = '0'
            break;
    }

    return [stylesInner as CSSProperties, stylesOuter as CSSProperties]
}
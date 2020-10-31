import { Ref } from 'preact';
import useMeasure from 'react-use-measure';
import { DataImage } from './hooks/upload';
import useStore, { Position } from './store';

export const CLASSES_OUTER = "bg-gray-200 bg-cover bg-center"
export const CLASSES_INNER = "rounded shadow-xl"

type CssStyles = { [_: string]: string | number }
type CompStyle = { inner?: CssStyles, outer?: CssStyles }

type InnerSettings = {
    backgroundImage: string,
    dataImage: DataImage | undefined,
    padding: number,
    position: Position,
}

export default function useCompositionStyles(srcBg: string, dataImage: DataImage | undefined): [Ref<HTMLElement>, CompStyle, CompStyle] {
    const padding = useStore(s => s.padding)
    const position = useStore(s => s.position)

    const settings = {
        backgroundImage: `url('${srcBg}')`,
        padding, position, dataImage
    }

    const [contRefScreen, screen] = useStylesScreen(settings)
    const render = useStylesRender(settings)

    return [contRefScreen, screen, render]
}

function useStylesScreen(settings: InnerSettings): [Ref<HTMLElement>, CompStyle] {
    const { padding, position, backgroundImage } = settings
    const [contRefScreen, { width }] = useMeasure()

    const imageWidth = settings.dataImage?.width
    const paddingScreen = padding * (imageWidth ? width / imageWidth : 1)

    const [posStylesInner, posStylesOuter] = getPositionStyles(paddingScreen, position)

    return [contRefScreen, {
        inner: posStylesInner,
        outer: { ...posStylesOuter, backgroundImage },
    }]
}

function useStylesRender(settings: InnerSettings): CompStyle {
    const { padding, position, dataImage, backgroundImage } = settings

    const width = dataImage?.width ?? 0
    const height = dataImage?.height ?? 0

    const shortX = position == Position.Left || position == Position.Right
    const shortY = position == Position.Top || position == Position.Bottom

    const widthPad = width + padding * (shortX ? 1 : 2)
    const heightPad = height + padding * (shortY ? 1 : 2)

    const [posStylesInner, posStylesOuter] = getPositionStyles(padding, position)

    return {
        inner: { ...posStylesInner, width, height },
        outer: { ...posStylesOuter, backgroundImage, width: widthPad, height: heightPad },
    }
}

function getPositionStyles(padding: number, position: Position): [CssStyles, CssStyles] {
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

    return [stylesInner as CssStyles, stylesOuter as CssStyles]
}
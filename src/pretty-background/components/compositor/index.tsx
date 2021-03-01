import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { animated } from 'react-spring';
import useMeasure from 'react-use-measure';
import { DropZoneWrap } from '../../../common/components/drop-zone';
import ImportDetails from '../../../common/components/import-info';
import { OUTER_BORDER_RADIUS } from '../../../common/constants';
import useExport, { Exports } from '../../../common/hooks/use-export';
import { setWarningOnClose, useWarningOnClose } from '../../../common/hooks/use-misc';
import useRenderBorderRadius from '../../../common/hooks/use-round-corners';
import { ChildrenWithProps, CssStyle, ForegroundImage } from '../../../common/misc/types';
import { getRenderScale, join } from '../../../common/misc/utils';
import { urls } from '../../misc/constants';
import { getImageSrcDownload } from '../../misc/utils';
import useOptionsStore from '../../stores/options';
import { CLASSES_INNER, CLASSES_OUTER_IMAGE, CLASSES_OUTER_PATTERN, useAnimatedCompositionStyles, useGetSizeBackground } from './use-comp-styles';

/** Renders the main image composition preview component. */
export default function Compositor({ children }: ChildrenWithProps<Exports>) {
    const [width, height] = useGetSizeBackground()
    const [ref, download, copy] = useExport(width, height, () => {
        setWarningOnClose(false)

        // Trigger 'download' call as required by the API guidelines
        const settings = useOptionsStore.getState()

        // eslint-disable-next-line no-console
        settings.backgroundImage && fetch(urls.apiUnsplashUse, { method: "POST", body: getImageSrcDownload(settings.backgroundImage) }).catch(console.error)
    })

    // Handle foreground inputs
    const image = useOptionsStore(s => s.backgroundImage)
    const pattern = useOptionsStore(s => s.backgroundPattern)
    const foreground = useOptionsStore(s => s.foreground)
    const setForeground = useCallback((foreground: ForegroundImage) => useOptionsStore.setState({ foreground }), [])

    useWarningOnClose(!!foreground) // Assume they're editing if they've add an image

    // Get the styles for the preview and hidden render components
    const [refCont, { width: contWidth }] = useMeasure()
    const [stylesScreen, stylesRender] = useAnimatedCompositionStyles(contWidth)

    // Get the outer border radius as the user can set the settings to render the image with transparent corners
    const outerRadiusRender = useRenderBorderRadius(getRenderScale(contWidth, stylesRender.outer?.width as number))

    const backgroundClasses = image ? CLASSES_OUTER_IMAGE : join(CLASSES_OUTER_PATTERN, pattern?.bgColour)

    return <>
        {/* Renders the preview */}
        <animated.section ref={refCont as any} style={{ ...stylesScreen.outer, borderRadius: OUTER_BORDER_RADIUS }}
            className={join(backgroundClasses, "inline-block max-w-screen-lg overflow-hidden shadow-md")}>
            <DropZoneWrap setImage={setForeground} title="Add a pretty background to your screenshots">
                {innerProps => foreground?.src
                    ? <Image style={stylesScreen.inner as any} />
                    : <animated.div className={join(CLASSES_INNER, "overflow-hidden bg-white")} style={stylesScreen.inner}>
                        <ImportDetails {...innerProps} title="Add a pretty background to your screenshots" />
                    </animated.div>}
            </DropZoneWrap>
        </animated.section>

        {/** A hacky hidden element used by dom-to-image to render the image.
         * We do this so we can set the image size exactly and render consistently on different browsers. */}
        {foreground && <div class="hidden">
            <section ref={ref} class={backgroundClasses} style={{ ...stylesRender.outer, borderRadius: outerRadiusRender } as any}>
                <Image style={stylesRender.inner as any} />
            </section>
        </div>}

        {foreground && children({ download, copy })}
    </>
}

function Image({ style }: CssStyle) {
    const image = useOptionsStore(s => s.foreground)
    return <animated.img src={image?.src} alt="Screenshot" className={CLASSES_INNER} style={style as any} />
}

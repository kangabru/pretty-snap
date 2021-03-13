import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { animated } from 'react-spring';
import { DropZoneWrap } from '../../../common/components/drop-zone';
import ExportWrapper from '../../../common/components/export';
import ImportDetails from '../../../common/components/import-info';
import { OUTER_BORDER_RADIUS } from '../../../common/constants';
import { Exports } from '../../../common/hooks/use-export';
import { setWarningOnClose, useWarningOnClose } from '../../../common/hooks/use-misc';
import { ChildrenWithProps, CssStyle, ForegroundImage } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import { urls } from '../../misc/constants';
import { getImageSrcDownload } from '../../misc/utils';
import useOptionsStore from '../../stores/options';
import { CLASSES_INNER, CLASSES_OUTER_IMAGE, CLASSES_OUTER_PATTERN, useAnimatedCompositionStyles, useCompositionStyles, useGetSizeBackground } from './use-comp-styles';

/** Renders the main image composition preview component. */
export default function Compositor({ children }: ChildrenWithProps<Exports>) {
    const [exportWidth, exportHeight] = useGetSizeBackground()

    const onExport = useCallback(() => {
        setWarningOnClose(false)

        // Trigger 'download' call as required by the API guidelines
        const settings = useOptionsStore.getState()

        // eslint-disable-next-line no-console
        settings.backgroundImage && fetch(urls.apiUnsplashUse, { method: "POST", body: getImageSrcDownload(settings.backgroundImage) }).catch(console.error)
    }, [])

    // Handle foreground inputs
    const image = useOptionsStore(s => s.backgroundImage)
    const pattern = useOptionsStore(s => s.backgroundPattern)
    const foreground = useOptionsStore(s => s.foreground)
    const setForeground = useCallback((foreground: ForegroundImage) => useOptionsStore.setState({ foreground }), [])

    useWarningOnClose(!!foreground) // Assume they're editing if they've add an image

    const backgroundClasses = image ? CLASSES_OUTER_IMAGE : join(CLASSES_OUTER_PATTERN, pattern?.bgColour)

    return <ExportWrapper {...{ exportWidth, exportHeight, onExport }}

        renderClient={
            ({ ref, width, height, download, copy }) => (
                <div class="col w-full space-y-6">

                    <Composition {...{ width, height }}>
                        {({ stylesAnim }) => (
                            <animated.section ref={ref} style={{ ...stylesAnim.outer, borderRadius: OUTER_BORDER_RADIUS }}
                                className={join(backgroundClasses, "inline-block max-w-screen-lg overflow-hidden shadow-md")}>
                                <DropZoneWrap setImage={setForeground} title="Add a pretty background to your screenshots">
                                    {innerProps => foreground?.src
                                        ? <Image style={stylesAnim.inner as any} />
                                        : <animated.div className={join(CLASSES_INNER, "overflow-hidden bg-white")} style={stylesAnim.inner}>
                                            <ImportDetails {...innerProps} title="Add a pretty background to your screenshots" />
                                        </animated.div>}
                                </DropZoneWrap>
                            </animated.section>
                        )}
                    </Composition>

                    {foreground && children({ download, copy })}
                </div>
            )}

        renderExport={
            ({ ref, width, height }) => (
                <Composition {...{ width, height }}>
                    {({ styles }) => (
                        <div ref={ref as any} class={backgroundClasses} style={{ ...styles.outer, width, height }}>
                            <Image style={styles.inner} />
                        </div>
                    )}
                </Composition>
            )}
    />
}

function Composition({ children, width, height }: ChildrenWithProps<any> & { width: number, height: number }) {
    const styles = useCompositionStyles(width, height)
    const stylesAnim = useAnimatedCompositionStyles(styles)
    return children({ styles, stylesAnim })
}

function Image({ style }: CssStyle) {
    const image = useOptionsStore(s => s.foreground)
    return <animated.img src={image?.src} alt="Screenshot" className={CLASSES_INNER} style={style as any} />
}

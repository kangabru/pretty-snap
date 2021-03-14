import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { animated } from 'react-spring';
import { DropZoneContainer } from '../../../common/components/drop-zone';
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
import { CLASSES_INNER, CLASSES_OUTER_IMAGE, CLASSES_OUTER_PATTERN, useAnimatedCompositionStyles, useBackgroundSize, useCompositionStyles } from './use-comp-styles';

/** Renders the main image composition preview component. */
export default function Compositor({ children }: ChildrenWithProps<Exports>) {

    // Well render the image at the same size as the imported image + background padding
    const [exportWidth, exportHeight] = useBackgroundSize()

    const imageFg = useOptionsStore(s => s.foreground) // the user's imported image
    const imageBg = useOptionsStore(s => s.backgroundImage) // an unsplash image (if selected)
    const pattern = useOptionsStore(s => s.backgroundPattern)
    const importImage = useCallback((foreground: ForegroundImage) => useOptionsStore.setState({ foreground }), [])

    // Assume they're editing if they've added an image but haven't exported it
    useWarningOnClose(!!imageFg)

    const onExport = useCallback(() => {
        setWarningOnClose(false) // Turn off warnings once they've exported something

        // Trigger 'download' call as required by the API guidelines
        const settings = useOptionsStore.getState()

        // eslint-disable-next-line no-console
        settings.backgroundImage && fetch(urls.apiUnsplashUse, { method: "POST", body: getImageSrcDownload(settings.backgroundImage) }).catch(console.error)
    }, [])

    const backgroundClasses = imageBg ? CLASSES_OUTER_IMAGE : join(CLASSES_OUTER_PATTERN, pattern?.bgColour)

    return <ExportWrapper {...{ exportWidth, exportHeight, onExport }}

        // The visible component the user interacts with
        renderClient={
            ({ ref, width, height, download, copy }) => (
                <div class="col w-full space-y-6">

                    {/* The image compositor where the user imports an image and views the composition */}
                    <Composition {...{ width, height }}>
                        {({ stylesAnim }) => (
                            <animated.section aria-label="Image compositor" ref={ref}
                                style={{ ...stylesAnim.outer, borderRadius: OUTER_BORDER_RADIUS }}
                                className={join(backgroundClasses, "inline-block max-w-screen-lg overflow-hidden shadow-md")}>

                                <DropZoneContainer setImage={importImage} title="Add a pretty background to your screenshots">
                                    {innerProps => imageFg?.src
                                        ? <Image style={stylesAnim.inner as any} />
                                        : <animated.div className={join(CLASSES_INNER, "overflow-hidden bg-white")} style={stylesAnim.inner}>
                                            <ImportDetails {...innerProps} title="Add a pretty background to your screenshots" />
                                        </animated.div>}
                                </DropZoneContainer>

                            </animated.section>
                        )}
                    </Composition>

                    {/* Render controls like export buttons etc */}
                    {imageFg && children({ download, copy })}
                </div>
            )}

        // An invisible component that will be exported as an image
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

/** This component gets the styles (like padding and borders) based on the selected image composition settings.
 * @returns The styles in two formats:
 *     - Raw styles that can be passed directly to an HTMl element
 *     - Animated styles that must be passed to a react-spring animated element
 */
function Composition({ children, width, height }: ChildrenWithProps<any> & { width: number, height: number }) {
    const styles = useCompositionStyles(width, height)
    const stylesAnim = useAnimatedCompositionStyles(styles)
    return children({ styles, stylesAnim })
}

/** Renders the imported 'foreground' image. */
function Image({ style }: CssStyle) {
    const image = useOptionsStore(s => s.foreground)
    return <animated.img src={image?.src} alt="Screenshot" className={CLASSES_INNER} style={style as any} />
}

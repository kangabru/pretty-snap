import { Fragment, h, Ref } from 'preact';
import useMeasure from 'react-use-measure';
import useExport, { ExportOptions } from '../hooks/use-export';
import useExportBorderRadius from '../hooks/use-round-corners';

/**
 * This is main entry point for the image export logic. Image exporting works as follows:
 *
 *  - The core image logic works by using the 'dom-to-image' library which exports a DOM node into an image.
 *    We therefore render a component to the DOM, pass that ref to the library, then can generate any image using HTML/CSS.
 *    We can also scale the image to any size because everything is more or less vectorised.
 *
 *  - To handle the export via react we place two components ('client' and 'export') into the DOM.
 *    We separate them because the final image can differ slightly from what the user sees on screen.
 *
 *  - The 'client' component is visible to the user and is what they interact with to create their image.
 *    This can include extra elements (e.g. a resize UI) that aren't typically exported to the final image.
 *
 *  - The 'export' component is invisible and is what is actually exported to the final image.
 *    Some extra styling is applied like transparent borders based on the advanced settings selected.
 *    Note that this component renders to the exact same size as the 'client' and is scaled via the 'dom-to-image' lib on export.
 *
 *  - Two functions ('download' and 'copy') are exposed to the client component which can trigger the image export.
 *    These come from the 'useExport' hook which actually handles the export logic.
 */

// Note that the width and height values here are the 'client' sizes as rendered on screen.
type ClientChildProps = { ref: Ref<HTMLElement>, width: number, height: number, download: ExportOptions, copy: ExportOptions }
type ExportChildProps = { ref: Ref<HTMLElement>, width: number, height: number }

type ExportWrapperProps = {
    onExport: () => void,
    exportWidth: number | undefined,
    exportHeight: number | undefined,
    renderClient: (_: ClientChildProps) => JSX.Element,
    renderExport: (_: ExportChildProps) => JSX.Element,
}

/** A component which handles common export logic for image compositions.
 * @param onExport - The function to call once the download or copy export functions have completed.
 * @param exportWidth - The final exported image width (before extra scaling).
 * @param exportHeight - The final exported image height (before extra scaling).
 * @param renderClient - The visible component the user can see and interact with.
 * @param renderExport - A hidden component that will be exported by the 'dom-to-image- library.
 */
export default function ExportWrapper(props: ExportWrapperProps) {

    // The final image can be any size but in order to do that we need to scale the 'export' component.
    // To do that we track the size of the 'client' component so we know how much to scale by.
    const [clientRef, { width, height }] = useMeasure()
    const scale = getScale([width, height], [props.exportWidth, props.exportHeight])

    // Pass in the client size and how much to scale by to produce the final image size
    const [exportRef, download, copy] = useExport({ scale, width, height }, props.onExport)

    // All apps have an advanced setting to render the image with rounded borders. Get that setting here.
    const exportBorderRadius = useExportBorderRadius()

    return <>
        {/* This component is visible on screen and is what the user interacts with */}
        {props.renderClient({ ref: clientRef, width, height, download, copy })}

        {/* This component will be scaled up and rendered into the final image */}
        <div class="hidden">
            <div ref={exportRef as any}>
                <section class="overflow-hidden" style={{ width, height, borderRadius: exportBorderRadius }}>
                    {props.renderExport({ ref: exportRef, width, height })}
                </section>
            </div>
        </div>
    </>
}

type SizeMaybe = [number | undefined, number | undefined]

/** Return the scale needed to export the component on screen to the final image size.
 * @note
 *     We usually choose the export size once a user has imported an image.
 *     Before then we don't really know what size is so we must expect undefined values.
 */
function getScale([clientW, clientH]: SizeMaybe, [exportW, exportH]: SizeMaybe) {
    const scaleW = (exportW ?? 1) / (clientW ?? 1)
    const scaleH = (exportH ?? 1) / (clientH ?? 1)
    return Math.min(scaleW, scaleH) // they should be the same but use min just in case
}

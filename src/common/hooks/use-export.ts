import domToImage, { Options as Dom2ImgOptions } from 'dom-to-image';
import { Ref, useEffect, useRef, useState } from "preact/hooks";
import mergeRefs from 'react-merge-refs';
import { delay } from '../misc/utils';

/**
 * This file handles the core export logic via 'download' and 'copy' actions.
 *
 * The core iamge logic works by using the 'dom-to-image' library which exports a DOM node into an image.
 * To export the image we take a DOM node (i.e. a react component) and pass the ref to the library.
 * We can render the image to any size so we apply a final scale so that image resolution isn't limited by the screen size.
 */

/**
 * @param scale - The amount to scale the export node by.
 * @param width - The client component width which will be scaled.
 * @param height - The client component height which will be scaled.
 */
export type ExportSize = { scale: number, width: number, height: number }

export type Exports = { download: ExportOptions, copy: ExportOptions }
export type ExportOptions = { run: () => void, state: ExportState, supported: boolean }

export enum ExportState {
    idle,
    loading,
    success, // Allows us to show a tick for a bit after export
    error,
}

const EXTRA_SCALE = 1

export default function useExport<T extends HTMLElement>(size: ExportSize, onSuccess?: () => void): [Ref<T>, ExportOptions, ExportOptions] {
    const [ref1, downloadStuff] = useDownload(size, onSuccess)
    const [ref2, copyStuff] = useCopy(size, onSuccess)
    const ref = mergeRefs([ref1, ref2]) as any as Ref<T>
    return [ref, downloadStuff, copyStuff]
}

/** Allows download an element as an image.
 * @returns containerRef: the ref to place on the element to export
 * @returns download: a function to trigger the download
 * @returns state: info about the progress of the download
 */
function useDownload<T extends HTMLElement>(size: ExportSize, onSuccess?: () => void): [Ref<T>, ExportOptions] {
    const ref = useRef<T>()
    const [download, state] = useExportImage(size, optns => domToImage.toPng(ref.current, optns).then(downloadImage).then(onSuccess))
    return [ref, { run: download, state, supported: true }]
}

/** Allows copying an element as an image to the clipboard.
 * @returns containerRef: the ref to place on the element to export
 * @returns download: a function to trigger the download
 * @returns state: info about the availability/progress of the download
 */
function useCopy<T extends HTMLElement>(size: ExportSize, onSuccess?: () => void): [Ref<T>, ExportOptions] {
    const ref = useRef<T>()
    const [copy, state] = useExportImage(size, optns => domToImage.toBlob(ref.current, optns).then(copyImageToClipboard).then(onSuccess))

    // Check if copying is supported on this browser
    const [canCopy, setCanCopy] = useState(false)
    useEffect(() => void canWriteToClipboard().then(setCanCopy), [])

    return [ref, { run: copy, state, supported: canCopy }]
}

/** A hook to provide common state management for exporting images.
 * @param The callback to perform the image save when the returned action is run.
 */
function useExportImage(size: ExportSize, saveImage: (o: Dom2ImgOptions) => void): [() => void, ExportState] {
    const [saveState, setSaveState] = useState<ExportState>(ExportState.idle)

    const action = async () => {
        try {
            setSaveState(ExportState.loading)
            await delay(500)

            // We scale the component to match our target image size.
            // We can also apply an extra scale if we have super high resolution or quality.
            // https://github.com/tsayen/dom-to-image/issues/69#issuecomment-486146688
            const scale = size.scale * EXTRA_SCALE
            await saveImage({
                width: size.width * scale,
                height: size.height * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }
            })

            setSaveState(ExportState.success)
            setTimeout(() => setSaveState(ExportState.idle), 1000) // Hide tick in a bit but continue the promise
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
            setSaveState(ExportState.error)
        }
    }

    return [action, saveState]
}

function downloadImage(dataUrl: string) {
    const t = new Date()
    const filename = `pretty_snap_${t.getFullYear()}_${t.getMonth()}_${t.getDate()}_${t.getHours()}_${t.getMinutes()}.png`

    const a = document.createElement('a')
    a.setAttribute('hidden', '1')
    a.setAttribute("href", dataUrl)
    a.setAttribute("download", filename)
    a.click()
    a.remove()
    plausible('download')
}

async function copyImageToClipboard(blob: Blob) {
    // @ts-ignore
    await canWriteToClipboard() && navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    plausible('copy')
}

/** Checks if copying an image to clipboard is supported by the browser.
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API (clipboard-write permission)
 */
async function canWriteToClipboard() {
    try {
        // @ts-ignore
        const result = await navigator.permissions.query({ name: "clipboard-write" })
        return result.state == "granted" || result.state == "prompt"
    } catch (error) {
        return false
    }
}

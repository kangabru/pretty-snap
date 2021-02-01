import domToImage, { Options as Dom2ImgOptions } from 'dom-to-image';
import { Ref, useEffect, useRef, useState } from "preact/hooks";
import mergeRefs from 'react-merge-refs';
import { delay } from '../misc/utils';

export enum SaveState {
    idle,
    loading, //
    success, // For a couple seconds after success
    error, // On error
}

export type ExportOptions = { download: DownloadOptions, copy: CopyOptions }

export type DownloadOptions = { download: ExportFunc, downloadState: SaveState }
export type CopyOptions = { copy: ExportFunc, copyState: SaveState, canCopy: boolean }

export type ExportFunc = (width: number, height: number) => Promise<void>


export default function useExport<T extends HTMLElement>(onSuccess?: () => void): [Ref<T>, DownloadOptions, CopyOptions] {
    const [ref1, downloadStuff] = useDownload(onSuccess)
    const [ref2, copyStuff] = useCopy(onSuccess)
    const ref = mergeRefs([ref1, ref2]) as any as Ref<T>
    return [ref, downloadStuff, copyStuff]
}


/** Allows download an element as an image.
 * @returns containerRef: the ref to place on the element to export
 * @returns download: a function to trigger the download
 * @returns state: info about the progress of the download
 */
function useDownload<T extends HTMLElement>(onSuccess?: () => void): [Ref<T>, DownloadOptions] {
    const ref = useRef<T>()
    const [download, downloadState] = useExportImage(optns => domToImage.toPng(ref.current, optns).then(downloadImage).then(onSuccess))
    return [ref, { download, downloadState }]
}


/** Allows copying an element as an image to the clipboard.
 * @returns containerRef: the ref to place on the element to export
 * @returns download: a function to trigger the download
 * @returns state: info about the availability/progress of the download
 */
function useCopy<T extends HTMLElement>(onSuccess?: () => void): [Ref<T>, CopyOptions] {
    const ref = useRef<T>()
    const [copy, copyState] = useExportImage(optns => domToImage.toBlob(ref.current, optns).then(copyImageToClipboard).then(onSuccess))

    // Check if copying is supported on this browser
    const [canCopy, setCanCopy] = useState(false)
    useEffect(() => void canWriteToClipboard().then(setCanCopy), [])

    return [ref, { canCopy, copy, copyState }]
}

/** A hook to provide common state management for exporting images.
 * @param The callback to perform the image save when the returned action is run.
 */
function useExportImage(saveImage: (o: Dom2ImgOptions) => void): [ExportFunc, SaveState] {
    const [saveState, setSaveState] = useState<SaveState>(SaveState.idle)

    const action: ExportFunc = async (width: number, height: number) => {
        try {
            setSaveState(SaveState.loading)
            await delay(500)
            await saveImage({ width, height })
            setSaveState(SaveState.success)
            setTimeout(() => setSaveState(SaveState.idle), 1000) // Hide tick in a bit but continue the promise
        } catch (error) {
            console.error(error)
            setSaveState(SaveState.error)
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

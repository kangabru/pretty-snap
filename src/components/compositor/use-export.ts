import domToImage, { Options as Dom2ImgOptions } from 'dom-to-image';
import { Ref, useEffect, useRef, useState } from "preact/hooks";
import { getSizeBackground } from './styles';
import useOptionsStore from '../stores/options';
import { urls } from '../../constants';

export enum SaveState {
    disabled, // Default state until user selects image
    ready, // Ready to run
    loading, //
    success, // For a couple seconds after success
    error, // On error
}

/** Allows download an element as an image.
 * @returns containerRef: the ref to place on the element to export
 * @returns download: a function to trigger the download
 * @returns state: info about the progress of the download
 */
export function useDownload<T extends HTMLElement>(): [Ref<T>, () => Promise<void>, SaveState] {
    const containerRef = useRef<T>()
    const [download, downloadState] = useExportImage(optns => domToImage.toPng(containerRef.current, optns).then(downloadImage))
    return [containerRef, download, downloadState]
}

/** Allows copying an element as an image to the clipboard.
 * @returns containerRef: the ref to place on the element to export
 * @returns download: a function to trigger the download
 * @returns state: info about the availability/progress of the download
 */
export function useCopy<T extends HTMLElement>(): [Ref<T>, boolean, () => Promise<void>, SaveState] {
    const containerRef = useRef<T>()
    const [copy, copyState] = useExportImage(optns => domToImage.toBlob(containerRef.current, optns).then(copyImageToClipboard))

    // Check if copying is supported on this browser
    const [canCopy, setCanCopy] = useState(false)
    useEffect(() => void canWriteToClipboard().then(setCanCopy), [])

    return [containerRef, canCopy, copy, copyState]
}

/** A hook to provide common state management for exporting images.
 * @param The callback to perform the image save when the returned action is run.
 */
function useExportImage(saveImage: (o: Dom2ImgOptions) => void): [() => Promise<void>, SaveState] {
    const foreground = useOptionsStore(s => s.foreground)
    const [saveState, setSaveState] = useState<SaveState>(SaveState.disabled)

    useEffect(() => { // Unclock when the user selects an image
        saveState == SaveState.disabled && !!foreground && setSaveState(SaveState.ready)
    }, [foreground])

    const action = async () => {
        if (foreground) {
            try {
                setSaveState(SaveState.loading)
                const settings = useOptionsStore.getState()
                const [width, height] = getSizeBackground(settings)
                setTimeout(async () => {
                    await saveImage({ width, height })
                    setSaveState(SaveState.success)
                    setTimeout(() => setSaveState(SaveState.ready), 1000)

                    // Trigger 'download' call as required by the API guidelines
                    settings.backgroundImage && fetch(urls.apiUnsplashUse, { method: "POST", body: settings.backgroundImage.srcDownload }).catch(console.log)
                }, 500)
            } catch (error) {
                console.error(error)
                setSaveState(SaveState.error)
            }
        }
        else setSaveState(SaveState.error)
    }

    return [action, saveState]
}

function downloadImage(dataUrl: string) {
    const a = document.createElement('a')
    a.setAttribute('hidden', '1')
    a.setAttribute("href", dataUrl)
    a.setAttribute("download", "test.png")
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
export async function canWriteToClipboard() {
    try {
        // @ts-ignore
        const result = await navigator.permissions.query({ name: "clipboard-write" })
        return result.state == "granted" || result.state == "prompt"
    } catch (error) {
        return false
    }
}

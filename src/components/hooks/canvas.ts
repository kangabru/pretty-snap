import domToImage, { Options as Dom2ImgOptions } from 'dom-to-image';
import { Ref, useEffect, useRef, useState } from "preact/hooks";
import { Settings as SettingsAll } from '../../types';
import { getSizeOuter } from '../compositor/styles';

export type Settings = Omit<SettingsAll, 'background'>

export enum SaveState {
    disabled, // Default state until user selects image
    ready, // Ready to run
    loading, //
    success, // For a couple seconds after success
    error, // On error
}

export function useDownload<T extends HTMLElement>(settings: Settings, initRef?: Ref<T>): [Ref<T>, () => Promise<void>, SaveState] {
    const containerRef = initRef ?? useRef<T>()
    const [download, downloadState] = useSaveImage(settings, optns => domToImage.toPng(containerRef.current, optns).then(downloadImage))
    return [containerRef, download, downloadState]
}

export function useCopy<T extends HTMLElement>(settings: Settings, initRef?: Ref<T>): [Ref<T>, boolean, () => Promise<void>, SaveState] {
    const containerRef = initRef ?? useRef<T>()
    const [copy, copyState] = useSaveImage(settings, optns => domToImage.toBlob(containerRef.current, optns).then(copyImage))

    const [canCopy, setCanCopy] = useState(false)
    useEffect(() => void canWriteToClipboard().then(setCanCopy), [])

    return [containerRef, canCopy, copy, copyState]
}

function useSaveImage(settings: Settings, saveImage: (o: Dom2ImgOptions) => void): [() => Promise<void>, SaveState] {
    const { foreground } = settings
    const [saveState, setSaveState] = useState<SaveState>(SaveState.disabled)

    useEffect(() => { // Unclock when the user selects an image
        saveState == SaveState.disabled && !!foreground && setSaveState(SaveState.ready)
    }, [foreground])

    const action = async () => {
        if (foreground) {
            try {
                setSaveState(SaveState.loading)
                const [width, height] = getSizeOuter(settings)
                console.log({ width, height, padding: settings.padding });

                setTimeout(async () => {
                    await saveImage({ width, height })
                    setSaveState(SaveState.success)
                    setTimeout(() => setSaveState(SaveState.ready), 1000)
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
}

async function copyImage(blob: Blob) {
    // @ts-ignore
    await canWriteToClipboard() && navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

export async function canWriteToClipboard() {
    try {
        // @ts-ignore
        const result = await navigator.permissions.query({ name: "clipboard-write" })
        return result.state == "granted" || result.state == "prompt"
    } catch (error) {
        return false
    }
}

export const setToClipboard = async (blob: Blob) => {
    // @ts-ignore
    const data = [new ClipboardItem({ [blob.type]: blob })]
    // @ts-ignore
    await navigator.clipboard.write(data)
}

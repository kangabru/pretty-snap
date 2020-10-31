import domToImage, { Options } from 'dom-to-image';
import { Ref, useEffect, useRef, useState } from "preact/hooks";
import { DataImage } from "./upload";

export type Settings = {
    dataImage?: DataImage | undefined,
    padding: number
}

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

function useSaveImage({ dataImage, padding }: Settings, saveImage: (o: Options) => void): [() => Promise<void>, SaveState] {
    const [saveState, setSaveState] = useState<SaveState>(SaveState.disabled)

    useEffect(() => { // Unclock when the user selects an image
        saveState == SaveState.disabled && !!dataImage && setSaveState(SaveState.ready)
    }, [dataImage])

    const action = async () => {
        if (dataImage) {
            try {
                setSaveState(SaveState.loading)
                setTimeout(async () => {
                    await saveImage({ width: dataImage.width + 2 * padding, height: dataImage.height + 2 * padding })
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

import { Ref, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { ForegroundImage } from '../../common/misc/types';

export type SetImage = (_: ForegroundImage) => void

/** Imports an image by pasting from clipboard */
export function useImagePaste(setDataUrl: SetImage) {
    useEffect(() => {
        const onPaste = (e: LocalClipboardEvent) => loadImageOnPaste(e).then(setDataUrl)
        document.addEventListener('paste', onPaste)
        return () => document.removeEventListener('paste', onPaste)
    }, [setDataUrl])
}

/** Imports an image by dragging and dropping from the file system. */
export function useImageDrop<T extends HTMLElement>(setDataUrl: SetImage): [Ref<T>, boolean, boolean] {
    const dropZone = useRef<T>()
    const [isDropping, setIsDropping] = useState(false)
    const [isError, setIsError] = useState(false)

    const onFileOver = useCallback((e: DragEvent) => {
        e.stopPropagation(); e.preventDefault();
        e.dataTransfer && (e.dataTransfer.dropEffect = 'copy')
        setIsDropping(true)
    }, [])

    const onFileLeave = useCallback((e: DragEvent) => {
        e.stopPropagation(); e.preventDefault();
        e.dataTransfer && (e.dataTransfer.dropEffect = 'none')
        setIsDropping(false)
    }, [])

    const onFileDrop = useCallback((e: DragEvent) => {
        e.stopPropagation(); e.preventDefault();
        loadImageOnDrop(e).then(dataUrl => {
            setIsError(false)
            setIsDropping(false)
            setDataUrl(dataUrl)
        }).catch(() => {
            setIsDropping(false)
            setIsError(true)
        })
    }, [setDataUrl])

    useLayoutEffect(() => {
        const zone = dropZone.current
        if (!zone) return
        zone.addEventListener('dragover', onFileOver)
        zone.addEventListener('dragleave', onFileLeave)
        zone.addEventListener('drop', onFileDrop)
        return () => {
            zone.removeEventListener('dragover', onFileOver)
            zone.removeEventListener('dragleave', onFileLeave)
            zone.removeEventListener('drop', onFileDrop)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropZone.current, onFileOver, onFileLeave, onFileDrop])

    return [dropZone, isDropping, isError]
}

/** Imports an image from a file input. */
function loadImageFromFile(file: File | null | undefined): Promise<ForegroundImage> {
    return new Promise((accept, reject) => {
        if (file?.type.match('image.*')) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onerror = () => reject("Error reading file")
            reader.onload = evt => loadImageFromDataUrl(evt.target?.result as string)
                .then(accept).catch(reject)
        }
        else if (file) reject("File is not an image")
        else reject("No data given")
    })
}

/** Loads an image data and dimensions */
export function loadImageFromDataUrl(dataUrl: string | undefined): Promise<ForegroundImage> {
    return new Promise((accept, reject) => {
        if (!dataUrl) return reject()
        const image = new Image()
        image.onerror = reject
        image.onload = () => {
            const width = image.naturalWidth
            const height = image.naturalHeight
            accept({ src: dataUrl, width, height })
        }
        image.src = dataUrl
    })
}

/** Wrapper for input 'onChange' events to load the image then perform a callback. */
export function onInputChange(setDataUrl: SetImage) {
    return (e: Event) => loadImageOnChange(e).then(setDataUrl)
}

function loadImageOnChange(e: Event): Promise<ForegroundImage> {
    return new Promise((accept, reject) => {
        const files = (e.target as HTMLInputElement)?.files
        if (files) loadImageFromFile(files[0]).then(accept).catch(reject)
        else reject("No data given")
    })
}

// Chrome specific type
type LocalClipboardEvent = ClipboardEvent & {
    originalEvent?: ClipboardEvent
}

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnPaste(e: LocalClipboardEvent): Promise<ForegroundImage> {
    return new Promise((accept, reject) => {
        const clipboardData = e.clipboardData || e.originalEvent?.clipboardData
        if (!clipboardData) return reject("No clipboard data")

        const items = clipboardData.items;
        let file: File | null = null
        for (let i = 0; i < items.length; i++)
            if (items[i].type.indexOf("image") === 0)
                file = items[i].getAsFile()

        loadImageFromFile(file).then(accept).catch(reject)
    })
}

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnDrop(e: DragEvent): Promise<ForegroundImage> {
    return new Promise((accept, reject) => {
        const files = e.dataTransfer?.files
        if (files) loadImageFromFile(files[0]).then(accept).catch(reject)
        else reject("No data given")
    })
}
import { Ref, useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

export function useImagePaste(setDataUrl: (dataUrl: string) => void) {
    useEffect(() => {
        const onPaste = (e: LocalClipboardEvent) => loadImageOnPaste(e).then(setDataUrl)
        document.addEventListener('paste', onPaste)
        return () => document.removeEventListener('paste', onPaste)
    }, [])
}

export function useImageDrop<T extends HTMLElement>(setDataUrl: (dataUrl: string) => void): [Ref<T>, boolean] {
    const dropZone = useRef<T>()
    const [isDropping, setIsDropping] = useState(false)

    const onFileOver = (e: DragEvent) => {
        e.stopPropagation(); e.preventDefault();
        e.dataTransfer && (e.dataTransfer.dropEffect = 'copy')
        setIsDropping(true)
    }
    const onFileLeave = (e: DragEvent) => {
        e.stopPropagation(); e.preventDefault();
        e.dataTransfer && (e.dataTransfer.dropEffect = 'none')
        setIsDropping(false)
    }
    const onFileDrop = (e: DragEvent) => {
        e.stopPropagation(); e.preventDefault();
        loadImageOnDrop(e).then(dataUrl => {
            setIsDropping(false)
            setDataUrl(dataUrl)
        })
    }

    useLayoutEffect(() => {
        var zone = dropZone.current
        zone.addEventListener('dragover', onFileOver)
        zone.addEventListener('dragleave', onFileLeave)
        zone.addEventListener('drop', onFileDrop)
        return () => {
            zone.removeEventListener('dragover', onFileOver)
            zone.removeEventListener('dragleave', onFileLeave)
            zone.removeEventListener('drop', onFileDrop)
        }
    }, [dropZone.current])

    return [dropZone, isDropping]
}

function loadImageFromFile(file: File | null | undefined): Promise<string> {
    return new Promise((accept, reject) => {
        if (file?.type.match('image.*')) {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (evt) => evt.target && accept(evt.target.result as string)
            reader.onerror = () => reject("Error reading file")
        }
        else if (file) reject("File is not an image")
        else reject("No data given")
    })
}

export function onInputChange(setDataUrl: (dataUrl: string) => void) {
    return (e: Event) => loadImageOnChange(e).then(setDataUrl)
}

function loadImageOnChange(e: Event): Promise<string> {
    return new Promise((accept, reject) => {
        var files = (e.target as HTMLInputElement)?.files
        if (files) loadImageFromFile(files[0]).then(accept).catch(reject)
        else reject("No data given")
    })
}

type LocalClipboardEvent = ClipboardEvent & {
    originalEvent?: ClipboardEvent
}

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnPaste(e: LocalClipboardEvent): Promise<string> {
    return new Promise((accept, reject) => {
        const clipboardData = e.clipboardData || e.originalEvent?.clipboardData
        if (!clipboardData) return reject("No clipboard data")

        const items = clipboardData.items;
        let file: File | null = null
        for (var i = 0; i < items.length; i++)
            if (items[i].type.indexOf("image") === 0)
                file = items[i].getAsFile()

        loadImageFromFile(file).then(accept).catch(reject)
    })
}

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnDrop(e: DragEvent): Promise<string> {
    return new Promise((accept, reject) => {
        var files = e.dataTransfer?.files
        if (files) loadImageFromFile(files[0]).then(accept).catch(reject)
        else reject("No data given")
    })
}
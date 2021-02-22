import { Inputs, useEffect, useState } from "preact/hooks"

export function useDocumentListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, inputs?: Inputs) {
    useEffect(() => {
        document.addEventListener(type, listener)
        return () => document.removeEventListener(type, listener)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, listener, ...(inputs ?? [])])
}

export type KeysHeld = { alt: boolean, ctrl: boolean, shift: boolean }

export function useKeysHeld(): KeysHeld {
    const [mouseDown, setMouseDown] = useState(false)
    const [keysHeld, setKeysHeld] = useState({ alt: false, ctrl: false, shift: false })
    useEffect(() => {
        const onMouseDown = () => setMouseDown(true)
        const onMouseUp = () => setMouseDown(false)
        document.addEventListener('mousedown', onMouseDown)
        document.addEventListener('mouseup', onMouseUp)

        const updateKeys = (e: KeyboardEvent) => {
            setKeysHeld({ alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey })
            if (mouseDown && e.key.toLowerCase() == 'alt') e.preventDefault() // Stop alt from opening the address bar when drawing
        }
        document.addEventListener('keydown', updateKeys)
        document.addEventListener('keyup', updateKeys)
        return () => {
            document.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('keydown', updateKeys)
            document.removeEventListener('keyup', updateKeys)
        }
    }, [mouseDown])
    return keysHeld
}
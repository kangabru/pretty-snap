import { Inputs, useCallback, useEffect, useState } from "preact/hooks"
import { IsAlt } from "../misc/keyboard"

export function useDocumentListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, inputs?: Inputs) {
    useEffect(() => {
        document.addEventListener(type, listener)
        return () => document.removeEventListener(type, listener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, listener, ...(inputs ?? [])])
}

export function useWindowListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, inputs?: Inputs) {
    useEffect(() => {
        window.addEventListener(type, listener)
        return () => window.removeEventListener(type, listener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, listener, ...(inputs ?? [])])
}

export type KeysHeld = { alt: boolean, ctrl: boolean, shift: boolean }

export function useKeysHeld(): KeysHeld {
    const [mouseDown, setMouseDown] = useState(false)
    const [keysHeld, setKeysHeld] = useState({ alt: false, ctrl: false, shift: false })

    useDocumentListener('mousedown', () => setMouseDown(true), [mouseDown])
    useDocumentListener('mouseup', () => setMouseDown(false), [mouseDown])

    const updateKeys = useCallback((e: KeyboardEvent) => {
        if (mouseDown && IsAlt(e)) e.preventDefault() // Stop alt from opening the address bar when drawing
        setKeysHeld(s => {
            const isEqual = (s.alt === e.altKey) && (s.ctrl === e.ctrlKey) && (s.shift === e.shiftKey)
            return isEqual ? s : { alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey }
        })
    }, [mouseDown])

    useDocumentListener('keydown', updateKeys, [mouseDown])
    useDocumentListener('keyup', updateKeys, [mouseDown])

    return keysHeld
}

export function setWarningOnClose(active: boolean) {
    window.onbeforeunload = active ? () => "You have unsaved changes. Are you sure you want to leave?" : null
}

export function useWarningOnClose(active: boolean) {
    useEffect(() => {
        setWarningOnClose(active)
        return () => setWarningOnClose(false)
    }, [active])
}

export function useSuperCommand(command: string, callback: () => void) {
    useDocumentListener('keypress', e => {
        if (e.key.toLowerCase() === command.toLowerCase())
            callback()
    }, [command])
}
import { Inputs, useEffect } from "preact/hooks"

export function useDocumentListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, inputs?: Inputs) {
    useEffect(() => {
        document.addEventListener(type, listener)
        return () => document.removeEventListener(type, listener)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, listener, ...(inputs ?? [])])
}
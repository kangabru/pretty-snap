import create from "zustand"
import { Annotation } from "../misc/types"

type AnnotationStore = {
    ids: string[],
    index: { [id: string]: Annotation },

    addAnnotation(_: any): void,
    undo(): void,
    redo(): void,
    undos: Annotation[],
    redos: Annotation[],
}

/** zustand state for state management  */
const useAnnotateStore = create<AnnotationStore>((set, get) => ({
    ids: [],
    index: {},

    addAnnotation: data => {
        const { undos, index, ids } = get()
        const newId = Math.random().toString(36).slice(2)
        const newAnnotation: Annotation = { id: newId, data }
        set({
            index: { ...index, [newId]: newAnnotation },
            ids: [...ids, newId],
            undos: [...undos, newAnnotation],
            redos: [],
        })
    },

    undo: () => {
        const { undos, redos, index, ids } = get()
        if (!undos.length) return

        const annotation = undos.slice(-1)[0]

        set({
            index: { ...index, [annotation.id]: undefined },
            ids: [...ids.filter(id => id !== annotation.id)],
            undos: undos.slice(0, -1),
            redos: [...redos, annotation],
        })
    },
    redo: () => {
        const { undos, redos, index, ids } = get()
        if (!redos.length) return

        const annotation = redos.slice(-1)[0]

        set({
            index: { ...index, [annotation.id]: annotation },
            ids: [...ids, annotation.id],
            undos: [...undos, annotation],
            redos: redos.slice(0, -1),
        })
    },
    undos: [],
    redos: [],
}))

export default useAnnotateStore
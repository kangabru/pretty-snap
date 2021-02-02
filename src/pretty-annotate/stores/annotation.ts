import create from "zustand"
import { Annotation } from "../misc/types"

type AnnotationStore = {
    annotationIds: string[],
    annotationIndex: { [id: string]: Annotation },

    addAnnotation(_: any): void,
    undo(): void,
    redo(): void,
    undos: Annotation[],
    redos: Annotation[],
}

/** zustand state for state management  */
const useAnnotateStore = create<AnnotationStore>((set, get) => ({
    annotationIds: [],
    annotationIndex: {},

    addAnnotation: data => {
        const { annotationIndex: index, annotationIds: ids } = get()
        const newId = Math.random().toString(36).slice(2)
        set({
            annotationIndex: { ...index, [newId]: { id: newId, data } },
            annotationIds: [...ids, newId],
        })
    },

    undo: () => { },
    redo: () => { },
    undos: [],
    redos: [],
}))

export default useAnnotateStore
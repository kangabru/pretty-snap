import create from "zustand"
import { Annotation, AnnotationItem, EditType, Style } from "../misc/types"

type AnnotationStore = {
    ids: string[], count: number,
    index: { [id: string]: AnnotationItem<any> | undefined },

    style: Style,
    styleOptions: { dashed: boolean },

    addAnnotation(_: Annotation<any>): void,
    undo(): void,
    redo(): void,
    undos: AnnotationItem<any>[],
    redos: AnnotationItem<any>[],
}

/** zustand state for state management  */
const useAnnotateStore = create<AnnotationStore>((set, get) => ({
    ids: [], index: {}, count: 1,

    style: Style.Counter,
    styleOptions: { dashed: true },

    addAnnotation: annotation => {
        const { undos, index, ids, count } = get()
        const id = Math.random().toString(36).slice(2)
        const annotationItem: AnnotationItem<any> = { ...annotation, id, type: EditType.Add }
        set({
            ids: [...ids, id],
            index: { ...index, [id]: annotationItem },
            undos: [...undos, annotationItem], redos: [],
            count: count + (annotation.style == Style.Counter ? 1 : 0),
        })
    },

    undo: () => {
        const { undos, redos, index, ids, count } = get()
        if (!undos.length) return

        const annotation = undos.slice(-1)[0]

        set({
            index: { ...index, [annotation.id]: undefined },
            ids: [...ids.filter(id => id !== annotation.id)],
            undos: undos.slice(0, -1), redos: [...redos, annotation],
            count: count - (annotation.style == Style.Counter ? 1 : 0),
        })
    },
    redo: () => {
        const { undos, redos, index, ids, count } = get()
        if (!redos.length) return

        const annotation = redos.slice(-1)[0]

        set({
            index: { ...index, [annotation.id]: annotation },
            ids: [...ids, annotation.id],
            undos: [...undos, annotation],
            redos: redos.slice(0, -1),
            count: count + (annotation.style == Style.Counter ? 1 : 0),
        })
    },
    undos: [],
    redos: [],
}))

export default useAnnotateStore
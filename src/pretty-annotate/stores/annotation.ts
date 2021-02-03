import create from "zustand"
import { Annotation, AnnotationAny, EditType, Style, StyleOptions } from "../misc/types"

type AnnotationStore = {
    ids: string[],
    index: { [id: string]: AnnotationAny | undefined },
    style: StyleOptions,

    addAnnotation(_: Annotation<any>): void,
    undo(): void,
    redo(): void,
    undos: UndoEvent[],
    redos: UndoEvent[],
}

type UndoEvent = AnnotationAny & { editType: EditType, id: string }

/** zustand state for state management  */
const useAnnotateStore = create<AnnotationStore>((set, get) => ({
    ids: [], index: {},

    style: {
        type: Style.Box,
        dashed: true,
        count: 1,
        colour: '#3b82f6',
    },

    addAnnotation: annotation => {
        const { undos, index, ids, style } = get()

        const id = Math.random().toString(36).slice(2)
        const annotationItem = <AnnotationAny>{ ...annotation, ...style }
        const undoEvent: UndoEvent = { ...annotationItem, id, editType: EditType.Add }

        set({
            ids: [...ids, id],
            index: { ...index, [id]: annotationItem },
            undos: [...undos, undoEvent], redos: [],
            style: IncrementCounter(style),
        })
    },

    undo: () => {
        const { undos, redos, index, ids, style } = get()
        if (!undos.length) return

        const annotation = undos.slice(-1)[0]

        set({
            index: { ...index, [annotation.id]: undefined },
            ids: [...ids.filter(id => id !== annotation.id)],
            undos: undos.slice(0, -1), redos: [...redos, annotation],
            style: IncrementCounter(style),
        })
    },
    redo: () => {
        const { undos, redos, index, ids, style } = get()
        if (!redos.length) return

        const annotation = redos.slice(-1)[0]

        set({
            index: { ...index, [annotation.id]: annotation },
            ids: [...ids, annotation.id],
            undos: [...undos, annotation],
            redos: redos.slice(0, -1),
            style: IncrementCounter(style, true),
        })
    },
    undos: [],
    redos: [],
}))

function IncrementCounter(style: StyleOptions, decrement?: boolean): StyleOptions {
    const { count } = style
    return { ...style, count: count + (style.type == Style.Counter ? (decrement ? -1 : 1) : 0) }
}

export default useAnnotateStore
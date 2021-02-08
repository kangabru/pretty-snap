import create from "zustand"
import { devtools } from 'zustand/middleware'
import { AnnotationAny, Style, StyleOptions } from "../misc/types"

type AnnotationStore = {
    ids: string[],
    index: { [id: string]: AnnotationAny | undefined },
    style: StyleOptions,

    saveAnnotation(_: AnnotationAny, ignoreHistory?: boolean): string,
    undo(): void,
    redo(): void,
    undos: UndoEvent[],
    redos: UndoEvent[],

    idEditing?: string,
    edit(id: string): void,
    editStop(): void,
}

type AnnotationMaybe = AnnotationAny | undefined
type UndoEvent = { id: string, dataPrev: AnnotationMaybe, dataNext: AnnotationMaybe }

/** zustand state for state management  */
const useAnnotateStore = create<AnnotationStore>(devtools((setRaw, get) => {
    const set = (name: string, partial: Partial<AnnotationStore>) => setRaw(partial, false, name)
    return ({
        ids: [], index: {},

        style: {
            type: Style.Text,
            dashed: true,
            count: 1,
            colour: '#3b82f6',
        },

        saveAnnotation: (annotation, ignoreHistory) => {
            const { undos, index, ids, style } = get()

            const isNew = !annotation.id
            const id = annotation.id ?? Math.random().toString(36).slice(2)
            const annotationItem = <AnnotationAny>{ ...annotation, ...style }
            const undoEvent: UndoEvent = { id, dataPrev: index[id], dataNext: annotationItem }

            const newUndos = ignoreHistory ? undos.slice() : [...undos, undoEvent]
            if (ignoreHistory && newUndos.length && newUndos.slice(-1)[0]?.id === id)
                newUndos[newUndos.length - 1].dataNext = annotationItem

            set("Save", {
                ids: AddIfNewId(ids, id),
                index: { ...index, [id]: annotationItem },
                undos: newUndos, redos: [],
                style: IncrementCounter(style),
                idEditing: isNew && shouldEditOnCreate(annotation.type) ? id : undefined,
            })

            return id
        },

        undo: () => {
            const { undos, redos, index, ids, style } = get()
            if (!undos.length) return

            const annotation = undos.slice(-1)[0]
            const wasNew = annotation.dataPrev === undefined

            set("Undo", {
                index: { ...index, [annotation.id]: annotation.dataPrev },
                ids: wasNew ? ids.slice(0, -1) : ids.slice(),
                undos: undos.slice(0, -1), redos: [...redos, annotation],
                style: IncrementCounter(style, true),
                idEditing: undefined,
            })
        },
        redo: () => {
            const { undos, redos, index, ids, style } = get()
            if (!redos.length) return

            const annotation = redos.slice(-1)[0]

            set("Redo", {
                index: { ...index, [annotation.id]: annotation.dataNext },
                ids: AddIfNewId(ids, annotation.id),
                undos: [...undos, annotation],
                redos: redos.slice(0, -1),
                style: IncrementCounter(style),
                idEditing: undefined,
            })
        },
        undos: [],
        redos: [],

        edit: idEditing => set("Edit", { idEditing }),
        editStop: () => set("Edit Stop", { idEditing: undefined }),
    })
}, "Annotate"))

/** Adds an ID if the ID is new */
function AddIfNewId(ids: string[], newId: string) {
    const isLastId = ids.slice(-1)[0] == newId
    return isLastId ? ids.slice() : [...ids, newId]
}

function shouldEditOnCreate(style: Style) {
    return style == Style.Text
}

function IncrementCounter(style: StyleOptions, decrement?: boolean): StyleOptions {
    const { count } = style
    return { ...style, count: count + (style.type == Style.Counter ? (decrement ? -1 : 1) : 0) }
}

export default useAnnotateStore
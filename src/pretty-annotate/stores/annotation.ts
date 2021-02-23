import create from "zustand"
import { devtools } from 'zustand/middleware'
import { colors } from "../misc/constants"
import { AnnotationAny, Shape, StyleOptions } from "../misc/types"

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
            shape: Shape.Box,
            count: 1,
            color: { color: colors.blue },
            style: { dashed: true },
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
                style: { ...style, count: style.count + (annotationItem.shape == Shape.Counter ? 1 : 0) },
                idEditing: isNew && shouldEditOnCreate(annotation.shape) ? id : undefined,
            })

            return id
        },

        undo: () => {
            const { undos, redos, index, ids, style } = get()
            if (!undos.length) return

            const lastUndo = undos.slice(-1)[0]
            const wasNew = lastUndo.dataPrev === undefined

            set("Undo", {
                index: { ...index, [lastUndo.id]: lastUndo.dataPrev },
                ids: wasNew ? ids.slice(0, -1) : ids.slice(),
                undos: undos.slice(0, -1), redos: [...redos, lastUndo],
                style: { ...style, count: lastUndo.dataNext?.count ?? style.count },
                idEditing: undefined,
            })
        },
        redo: () => {
            const { undos, redos, index, ids, style } = get()
            if (!redos.length) return

            const lastRedo = redos.slice(-1)[0]

            set("Redo", {
                index: { ...index, [lastRedo.id]: lastRedo.dataNext },
                ids: AddIfNewId(ids, lastRedo.id),
                undos: [...undos, lastRedo],
                redos: redos.slice(0, -1),
                style: { ...style, count: 1 + (lastRedo.dataNext?.count ?? style.count) },
                idEditing: undefined,
            })
        },
        undos: [],
        redos: [],

        edit: idEditing => set("Edit", { idEditing }),
        editStop: () => {
            const { idEditing, index, ids } = get()
            const item = index[idEditing ?? ""]

            if (idEditing && item && item.shape == Shape.Text && !item.text) {
                // Remove new text annotations that haven't been confirmed
                set("Text cancel", {
                    index: { ...index, [idEditing]: undefined },
                    ids: ids.slice(0, -1),
                    idEditing: undefined,
                })
            } else
                set("Edit cancel", { idEditing: undefined })
        },
    })
}, "Annotate"))

/** Adds an ID if the ID is new */
function AddIfNewId(ids: string[], newId: string) {
    const isLastId = ids.slice(-1)[0] == newId
    return isLastId ? ids.slice() : [...ids, newId]
}

function shouldEditOnCreate(style: Shape) {
    return style == Shape.Text
}

export default useAnnotateStore
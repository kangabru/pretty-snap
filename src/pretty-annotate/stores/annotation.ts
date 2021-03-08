import create from "zustand"
import { devtools } from 'zustand/middleware'
import { colors } from "../misc/constants"
import { AnnotationAny, Shape, ShapeStyle, StyleOptions } from "../misc/types"

type AnnotationStore = {
    ids: string[],
    index: { [id: string]: AnnotationAny | undefined },
    style: StyleOptions,

    save(_: AnnotationAny): string,

    undo(): void,
    redo(): void,
    undos: UndoEvent[],
    redos: UndoEvent[],

    editId?: string,
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
            shapeStyle: ShapeStyle.Outline,
            color: { color: colors.blue },
            count: 1,
        },

        save: _annotation => {
            const { undos, index, ids, style } = get()

            const id = _annotation.id ?? Math.random().toString(36).slice(2)

            const annotation = <AnnotationAny>{ ..._annotation, id }
            const undoEvent: UndoEvent = { id, dataPrev: index[id], dataNext: annotation }

            const newUndos = [...undos, undoEvent]

            set("Save", {
                ids: AddIfNewId(ids, id),
                index: { ...index, [id]: annotation },
                undos: newUndos, redos: [],
                style: { ...style, count: style.count + (annotation.shape == Shape.Counter ? 1 : 0) },
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
                editId: undefined,
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
                editId: undefined,
            })
        },
        undos: [],
        redos: [],

        edit: idEditing => set("Edit", { editId: idEditing }),

        /** The text component works in a two step process:
         * - The user clicks somewhere which triggers the usual state update and puts the tet in 'edit mode'
         * - When the users saves or cancels, the state has to updated or reset so the existing item doesn't create 2 undo events
         */
        editStop: () => {
            const { editId: idEditing, index, ids, undos } = get()
            const item = index[idEditing ?? ""]

            if (idEditing && item && item.shape == Shape.Text && !item.text) {
                // Remove new text annotations that haven't been confirmed
                set("Text cancel", {
                    editId: undefined,
                    ids: ids.slice(0, -1),
                    undos: undos.slice(0, -1),
                    index: { ...index, [idEditing]: undefined },
                })
            } else
                set("Edit cancel", { editId: undefined })
        },
    })
}, "Annotate"))

/** Adds an ID if the ID is new */
function AddIfNewId(ids: string[], newId: string) {
    const hasId = ids.includes(newId)
    return hasId ? ids.slice() : [...ids, newId]
}

export default useAnnotateStore
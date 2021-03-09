import create from "zustand"
import { devtools } from 'zustand/middleware'
import { colors } from "../misc/constants"
import { Annotation, AnnotationAny, Shape, ShapeStyle, StyleOptions } from "../misc/types"

type AnnotationStore = {
    ids: string[],
    index: { [id: string]: AnnotationAny | undefined },
    style: StyleOptions,

    save(_: AnnotationAny): string,
    saveText(_: Annotation<Shape.Text>): string,
    saveStyle(_: Partial<StyleOptions>): void,

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
            shape: Shape.Text,
            shapeStyle: ShapeStyle.Outline,
            color: { color: colors.blue },
            count: 1,
        },

        save: _annotation => {
            const { undos, index, ids, style } = get()

            const id = _annotation.id ?? Math.random().toString(36).slice(2)

            const annotation = <AnnotationAny>{ ..._annotation, id }
            const undoEvent: UndoEvent = { id, dataPrev: index[id], dataNext: annotation }

            set("Save", {
                ids: AddIfNewId(ids, id),
                index: { ...index, [id]: annotation },
                undos: [...undos, undoEvent],
                redos: [],
                style: { ...style, count: style.count + (annotation.shape == Shape.Counter ? 1 : 0) },
            })

            return id
        },

        /** TODO */
        saveStyle: stylePartial => {
            const { editId, style } = get()

            // Update the global style settings
            const styleMerged = { ...style, ...stylePartial }
            set("Save Style", { style: styleMerged })

            // Update the current annotation style if any
            if (editId) {
                const { index, save } = get()
                const annotation = index[editId]
                annotation && save({ ...annotation, ...stylePartial, id: editId })
            }
        },

        /** Text annotations have a 2 step save process:
         * 1. Text is placed somewhere but without a text value
         * 2. The user enters the text and saves again
         *
         * The problem is that by using the normal save method we create 2 histories.
         * If the user were to undo they would see the placement and subsequent edit events.
         * This method handles that situation so we only save 1 history event.
         *
         * The 'editStop' function handles the case were the user cancels before the second save.
         */
        saveText: annotation => {
            const { index, save } = get()
            const lastSave = index[annotation.id as string] // The last save if it exists

            // Save as normal
            const id = save(annotation)

            // Get the update state
            const { undos } = get()

            // Step 1: The user is placing the text without a text value
            if (!lastSave) {
                set("Save Text #1", {
                    editId: id, // Immediately edit this annotation so the user can enter text
                    undos: undos.slice(0, -1), // Don't include this in the history
                })
            }

            // Step 2: The user has entered text
            else if (!lastSave.text) {
                // Copy the last undo but without the previous state (the one without text)
                const lastUndo: UndoEvent = { ...undos.slice(-1)[0], dataPrev: undefined }
                set("Save Text #2", {
                    editId: undefined, // Stop editing
                    undos: [...undos.slice(0, -1), lastUndo], // Update the last undo
                })
            }

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
    const _ids = ids.slice().filter(id => id !== newId)
    return [..._ids, newId] // move updates to the top of the z-index
}

export default useAnnotateStore
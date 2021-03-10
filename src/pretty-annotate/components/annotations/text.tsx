import { h } from 'preact';
import { useRef, useState, useLayoutEffect } from 'react';
import { SelectableAreaProps } from '.';
import useDevMode from '../../../common/hooks/use-dev-mode';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { KEYS } from '../../../common/misc/keyboard';
import { join, onKeys, remToPixels, textClass, useRandomItem } from '../../../common/misc/utils';
import { Annotation, Position, Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import { CounterSelectableArea } from './counter';

type Props = Annotation<Shape.Text>

const DEFAULT_TEXTS = [
    "Hello",
    "Oh hey",
    "Hi 👋",
]

const CLASS_POSITION = "absolute transform -translate-x-6 -translate-y-6"
const CLASS_STYLE = "hover:cursor-crosshair px-2.5 py-1 rounded-lg font-bold text-xl font-mono grid place-items-center select-none"

export default function Text(props: Props) {
    const { id, text, left, top, color: { color, useDarkText } } = props

    const editing = useAnnotateStore(s => id && s.editId === id)
    const emptyText = useRandomItem(DEFAULT_TEXTS)

    return editing
        ? <TextInput {...props} />
        : <span style={{ left, top, backgroundColor: color }}
            class={join(CLASS_POSITION, CLASS_STYLE, textClass(useDarkText),)}>
            {text ?? emptyText}
        </span>
}

/** The text component works in a two step process:
 * - The user clicks somewhere which triggers the usual state update and puts the tet in 'edit mode'
 * - When the users saves or cancels, the state has to updated or reset so the existing item doesn't create 2 undo events
 */
function TextInput(props: Props) {
    const { text, top, color: { color: colour, useDarkText } } = props
    const left = offLeft(props as Position)

    const ref = useRef<HTMLInputElement>()
    const [textEdits, setTextEdits] = useState(text)

    const cancel = useAnnotateStore(s => s.editStop)
    const save = () => {
        const { saveText } = useAnnotateStore.getState()
        if (textEdits == text) cancel() // Doesn't create an undo event
        else saveText({ ...props, text: textEdits })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => void ref.current?.focus(), [ref.current]) // focus on load
    useDocumentListener('mousedown', save)

    return <div style={{ left, top }} class={join(CLASS_POSITION, textClass(useDarkText), "flex flex-col items-end")}>

        {/* The movable area symbol. This doesn't move the text directly but is placed where the invisible 'selectable area' is located. */}
        <svg class="absolute left-1 top-1.5 h-6" fill="currentColor" viewBox="0 0 14 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="2.4" fill='currentColor' />
            <circle cx="10" cy="4" r="2.4" fill='currentColor' />
            <circle cx="4" cy="10" r="2.4" fill='currentColor' />
            <circle cx="10" cy="10" r="2.4" fill='currentColor' />
            <circle cx="4" cy="16" r="2.4" fill='currentColor' />
            <circle cx="10" cy="16" r="2.4" fill='currentColor' />
        </svg>

        {/* The editable text input */}
        <input ref={ref as any} value={textEdits} style={{ backgroundColor: colour }}
            class={join(CLASS_STYLE, "pl-7 ring-4 ring-gray-300 ring-opacity-60 outline-none focus:outline-none pointer-events-auto")}
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onKeyDown={onKeys({ [KEYS.Escape]: cancel, [KEYS.Enter]: save })}
            onInput={e => setTextEdits(e.currentTarget.value)} />

        <span class="text-xs text-gray-800 font-bold bg-gray-200 mt-2 px-1 rounded whitespace-nowrap">Enter to save</span>
    </div>
}

/** Renders two possible hidden selectable areas:
 * - A large rectangular area used to select the annotation on click
 * - A circular area to the left of the text used to the move the annotation whilst it's being editing
 */
export function TextSelectableArea({ annotation, events, class: cls }: SelectableAreaProps) {
    const { id, left, top, text } = annotation
    const _left = offLeft(annotation as Position)

    const isDevMode = useDevMode()
    const editing = useAnnotateStore(s => id && s.editId === id)

    return editing
        ? <CounterSelectableArea annotation={{ ...annotation, left: _left }} events={events} class="cursor-move" />
        : <div style={{ left, top }} class={join("w-min cursor-text whitespace-nowrap", cls,
            CLASS_POSITION, CLASS_STYLE, isDevMode ? "opacity-30" : "opacity-0")}>
            <span>{text}</span>
            <div {...events} class={join("absolute -inset-2", isDevMode && "bg-black")} />
        </div>
}

/** The text input in edit mode displays a 'move' symbol to the left of the text.
 * This function offsets the left position so that text in edit or normal modes is always aligned.
 */
function offLeft(bounds: Position) {
    return bounds.left - remToPixels(1.25)
}
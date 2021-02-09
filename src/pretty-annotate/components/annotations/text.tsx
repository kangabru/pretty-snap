import { h } from 'preact';
import { useLayoutEffect, useRef, useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/misc';
import { join, onKeys, textClass, useRandomItem } from '../../../common/misc/utils';
import { Annotation, Style } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';

type Props = Annotation<Style.Text>

const DEFAULT_TEXTS = [
    "Hello",
    "Oh hey",
    "Hi 👋",
]

const CLASS_POSITION = "absolute transform -translate-x-6 -translate-y-6"
const CLASS_STYLE = "hover:cursor-crosshair px-2 py-1 rounded-lg font-bold text-xl font-mono grid place-items-center select-none"

export default function Text(props: Props) {
    const { id, text, useDarkText } = props

    const canEdit = useAnnotateStore(s => s.style.type == Style.Text)
    const editing = useAnnotateStore(s => canEdit && id && s.idEditing === id)

    const edit = useAnnotateStore(s => s.edit)
    const editOnClick = (e: Event) => { if (id) { edit(id); e.stopPropagation() } }

    const emptyText = useRandomItem(DEFAULT_TEXTS)

    return editing
        ? <TextInput {...props} />
        : <span style={getStyle(props)} onClick={canEdit ? editOnClick : undefined}
            class={join(CLASS_POSITION, CLASS_STYLE, textClass(useDarkText), canEdit ? "cursor-text pointer-events-auto" : "pointer-events-none")}>
            {text ?? emptyText}
        </span>
}

function TextInput(props: Props) {
    const { text, left, top, colour, useDarkText } = props

    const ref = useRef<HTMLInputElement>()
    const [textEdits, setTextEdits] = useState(text)

    const cancel = useAnnotateStore(s => s.editStop)
    const saveText = useAnnotateStore(s => s.saveAnnotation)

    const save = () => {
        if (textEdits == text) cancel() // Doesn't create an undo event
        else saveText({ ...props, text: textEdits }, !text) // Creates an undo event
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => void ref.current?.focus(), [ref.current])
    useDocumentListener('mousedown', save)

    return <div style={{ left, top }} class={join(CLASS_POSITION, "flex flex-col items-end space-y-2")}>

        <input ref={ref as any} value={textEdits} style={{ backgroundColor: colour }}
            class={join(CLASS_STYLE, textClass(useDarkText), "ring-4 ring-gray-300 ring-opacity-60 outline-none focus:outline-none pointer-events-auto")}
            onMouseDown={e => e.stopPropagation()}
            onKeyDown={onKeys({ 'Escape': cancel, 'Enter': save })}
            onInput={e => setTextEdits(e.currentTarget.value)} />

        <span class="text-xs text-gray-800 font-bold bg-gray-200 px-1 rounded whitespace-nowrap">Enter to save</span>
    </div>
}

function getStyle({ top, left, colour }: Props) {
    return { left, top, backgroundColor: colour }
}
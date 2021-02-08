import { h } from 'preact';
import { useLayoutEffect, useRef, useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/misc';
import { join, onKeys, useRandomItem } from '../../../common/misc/utils';
import { Annotation, Style } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';

type Props = Annotation<Style.Text>

const DEFAULT_TEXTS = [
    "Hello",
    "Oh hey",
    "Hi 👋",
]

const CLS = "hover:cursor-crosshair absolute px-2 py-1 rounded-lg text-white font-bold text-xl font-mono grid place-items-center select-none transform -translate-x-6 -translate-y-6 ring-gray-200 ring-opacity-60"

export default function Text(props: Props) {
    const { id, text } = props

    const canEdit = useAnnotateStore(s => s.style.type == Style.Text)
    const editable = useAnnotateStore(s => canEdit && id && s.idEditing === id)

    const edit = useAnnotateStore(s => s.edit)
    const editOnClick = (e: Event) => { if (id) { edit(id); e.stopPropagation() } }

    const emptyText = useRandomItem(DEFAULT_TEXTS)

    return editable
        ? <TextInput {...props} />
        : <span style={getStyle(props)} class={join(CLS, canEdit ? "cursor-text pointer-events-auto" : "pointer-events-none")}
            onClick={canEdit ? editOnClick : undefined}>
            {text ?? emptyText}
        </span>
}

function TextInput(props: Props) {
    const { id, text } = props

    const ref = useRef<HTMLInputElement>()
    const [textEdits, setTextEdits] = useState(text)

    const stop = useAnnotateStore(s => s.editStop)
    const saveText = useAnnotateStore(s => s.saveAnnotation)
    const editable = useAnnotateStore(s => id && s.idEditing === id)

    const save = () => {
        if (!editable) return
        if (textEdits == text) stop() // Doesn't create an undo event
        else saveText({ ...props, text: textEdits }, !text) // Creates an undo event
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => void ref.current?.focus(), [ref.current])
    useDocumentListener('mousedown', save, [editable])

    return <input ref={ref as any} value={textEdits}
        style={getStyle(props)} class={join(CLS, "ring-4 pointer-events-auto")}
        onMouseDown={e => e.stopPropagation()}
        onKeyDown={onKeys({ 'Escape': save, 'Enter': save })}
        onInput={e => setTextEdits(e.currentTarget.value)} />
}

function getStyle({ top, left, colour }: Props) {
    return { left, top, backgroundColor: colour }
}
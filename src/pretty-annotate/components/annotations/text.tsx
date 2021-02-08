import { h } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/misc';
import { join, onKeys } from '../../../common/misc/utils';
import { Annotation, Style } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';

const DEFAULT_TEXT = "Hello"

export default function Text(props: Annotation<Style.Text>) {
    const { id, left, top, colour, text } = props

    const ref = useRef<HTMLInputElement>()

    const editable = useAnnotateStore(s => id && s.idEditing === id)
    const edit = useAnnotateStore(s => s.edit)
    const stop = useAnnotateStore(s => s.editStop)
    const saveText = useAnnotateStore(s => s.saveAnnotation)

    const [textEdits, setTextEdits] = useState("")
    useEffect(() => {
        if (editable) setTextEdits(text ?? DEFAULT_TEXT)
    }, [text, editable])

    const save = () => {
        if (!editable) return
        if (textEdits == text) stop() // Doesn't create an undo event
        else saveText({ ...props, text: textEdits }, !text) // Creates an undo event
    }

    const stopPropagation = (e: Event) => e.stopPropagation()
    const editOnClick = (e: Event) => {
        if (!id) return
        edit(id)
        ref.current?.focus()
        e.stopPropagation()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => void ref.current?.focus(), [ref.current])
    useDocumentListener('mousedown', save, [editable])

    const style = { left, top, backgroundColor: colour }
    const cls = join(editable && "ring-4", "hover:cursor-crosshair absolute px-2 py-1 rounded-lg text-white font-bold text-xl font-mono grid place-items-center select-none transform -translate-x-6 -translate-y-6 ring-gray-200 ring-opacity-60")

    return editable
        ? <input ref={ref as any} class={cls} style={style} value={textEdits}
            onMouseDown={stopPropagation}
            onKeyDown={onKeys({ 'Escape': save, 'Enter': save })}
            onInput={e => setTextEdits(e.currentTarget.value)} />
        : <span class={join(cls, "cursor-text")} style={style} onClick={editOnClick}>{text ?? DEFAULT_TEXT}</span>
}

import { Fragment, h } from 'preact';
import { useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/misc';
import { join } from '../../../common/misc/utils';
import { colors } from '../../misc/constants';
import useAnnotateStore from '../../stores/annotation';
import { useRingColourStyle, useRingColourWithOpacity, VAR_RING_COLOR } from './misc';

export default function ColorButtonGroup() {
    const [showColours, setShowColours] = useState(false)
    useDocumentListener('mousedown', () => setShowColours(false), [showColours])
    useDocumentListener('keydown', e => e.key === "Escape" && setShowColours(false), [showColours])

    const color = useAnnotateStore(s => s.style.color.color)
    const [ref, ringColor] = useRingColourStyle()

    return <div class="flex relative" onMouseDown={e => e.stopPropagation()}>
        <button ref={ref} onClick={() => setShowColours(true)}
            style={{ backgroundColor: color, [VAR_RING_COLOR]: ringColor }}
            class="w-12 h-12 rounded-md grid place-items-center outline-ring" />

        {showColours && <div class="absolute top-full mt-2 -ml-2 shadow rounded-lg">
            <Triangle />
            <div class="relative flex space-x-2 rounded-lg bg-white p-3">
                <ColorButton color={colors.blue} />
                <ColorButton color={colors.red} />
                <ColorButton color={colors.yellow} />
                <ColorButton color={colors.green} />
                <ColorButton color={colors.dark} />
                <ColorButton color={colors.light} useDarkText />
            </div>
        </div>}
    </div>
}

function Triangle() {
    return <>
        <div class="absolute top-0 left-4 transform -translate-y-full -mt-px" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid rgba(0, 0, 0, 0.2)',
            filter: 'blur(2px)',
        }} />
        <div class="absolute top-0 left-4 transform -translate-y-full" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid white',
        }} />
    </>
}

function ColorButton({ color, useDarkText }: { color: string, useDarkText?: boolean }) {
    const [ref, ringColor] = useRingColourWithOpacity(useDarkText ? colors.dark : color)
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, color: { color: color, useDarkText } } })
    }
    return <button ref={ref} onClick={setColour}
        style={{ backgroundColor: color, [VAR_RING_COLOR]: ringColor }}
        class={join("w-12 h-12 relative rounded-md grid place-items-center outline-ring border-2",
            useDarkText ? "border-gray-400" : "border-transparent")} />
}
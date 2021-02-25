import { Fragment, h } from 'preact';
import { useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/misc';
import { join } from '../../../common/misc/utils';
import { colors } from '../../misc/constants';
import useAnnotateStore from '../../stores/annotation';

export default function ColorButtonGroup() {
    const [showColours, setShowColours] = useState(false)
    useDocumentListener('mousedown', () => setShowColours(false), [showColours])
    useDocumentListener('keydown', e => e.key === "Escape" && setShowColours(false), [showColours])

    const { color: { color } } = useAnnotateStore(s => s.style)

    return <div class="flex relative" onMouseDown={e => e.stopPropagation()}>
        <button onClick={() => setShowColours(true)} style={{ backgroundColor: color }} class="w-12 h-12 rounded-md grid place-items-center" />

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
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, color: { color: color, useDarkText } } })
    }
    return <button onClick={setColour} style={{ backgroundColor: color }}
        class={join("relative w-12 h-12 rounded-md grid place-items-center", useDarkText && "border-2 border-gray-500")} />
}
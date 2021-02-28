import { h } from 'preact';
import { Ref, useEffect, useRef } from 'preact/hooks';
import { Position } from '../../misc/types';
import { join } from '../../../common/misc/utils';
import useOptionsStore from '../../stores/options';

const positions = [
    Position.Center,
    Position.Bottom,
    Position.Left,
    Position.Right,
]

/** Renders the position buttons in the control panel. */
export default function CompositorPositions() {
    return <div class="inline-flex w-full bg-gray-100 rounded" role="group">
        {positions.map(p => <PositionButton position={p} />)}
    </div>
}

function PositionButton(props: { position: Position }) {
    const { position } = props
    const positionActual = useOptionsStore(x => x.position)
    const setPosition = () => useOptionsStore.setState({ position: props.position })
    const isSelected = positionActual == position

    const [ref, onKeyDown] = useLeftRightActionWhenFocused(isSelected)

    const { title, x, y } = {
        [Position.Left]: { title: "Align left", x: 2, y: 6 },
        [Position.Center]: { title: "Align center", x: 6, y: 6 },
        [Position.Bottom]: { title: "Align bottom", x: 6, y: 10 },
        [Position.Right]: { title: "Align right", x: 10, y: 6 },
        [Position.Top]: { title: "Align top", x: 6, y: 2 },
    }[position]

    return <button ref={ref} title={title} onClick={setPosition} onKeyDown={onKeyDown} tabIndex={position == positionActual ? 0 : -1}
        class={join("flex-1 sm:flex-auto p-2 outline-primary text-center transition rounded",
            isSelected ? "bg-primary-base hover:bg-primary-dark text-gray-100 z-10" : "text-gray-700 hover:bg-gray-300",
            position == Position.Center && "rounded-l",
            position == Position.Right && "rounded-r")}>
        <svg class="inline w-6 h-6" viewBox="1 1 22 22" xmlns="http://www.w3.org/2000/svg">
            <rect fill="currentColor" stroke="none" rx="2" x={x} y={y} width="12" height="12" />
            <rect fill="none" stroke="currentColor" rx="2" x="2" y="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
    </button >
}

/** Allows the user to change the position by left and right arrows. */
function useLeftRightActionWhenFocused(isSelected: boolean): [Ref<HTMLButtonElement>, (e: KeyboardEvent) => void] {
    const ref = useRef<HTMLButtonElement>()
    useEffect(() => { isSelected && ref.current.focus() }, [isSelected])

    const currentPosition = useOptionsStore(x => x.position)
    const index = positions.indexOf(currentPosition)
    const onKeyDown = (e: KeyboardEvent) => {
        let newIndex = index
        if (e.key == 'ArrowLeft') newIndex = Math.max(0, index - 1)
        if (e.key == 'ArrowRight') newIndex = Math.min(index + 1, positions.length - 1)
        if (index != newIndex) useOptionsStore.setState({ position: positions[newIndex] })
    }

    return [ref, onKeyDown]
}

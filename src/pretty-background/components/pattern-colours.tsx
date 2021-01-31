import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { useChildNavigate } from '../../common/hooks/use-child-nav';
import { join } from '../../common/misc/utils';
import colours from '../data/colours';
import useOptionsStore from '../stores/options';

export function PatternColours() {
    const colour = useOptionsStore(s => s.backgroundPattern?.svgColour)
    const opacity = useOptionsStore(s => s.backgroundPattern?.svgOpacity)
    const ref = useChildNavigate<HTMLDivElement>([colour, opacity])

    return <div ref={ref} class="row flex-wrap justify-center">
        <PatternColor colour={colours.white} opacity={0.5} />
        <PatternColor colour={colours.white} opacity={0.75} />
        <PatternColor colour={colours.white} opacity={1} />
        <PatternColor colour={colours.black} opacity={0.25} />
        <PatternColor colour={colours.black} opacity={0.5} />
        <PatternColor colour={colours.black} opacity={0.75} />
    </div>
}

function PatternColor({ colour, opacity }: { colour: string, opacity: number }) {
    const _colour = useOptionsStore(s => s.backgroundPattern?.svgColour)
    const _opacity = useOptionsStore(s => s.backgroundPattern?.svgOpacity)
    const onClick = () => useOptionsStore.getState().setPatternColour(colour, opacity)
    const backgroundColor = useOptionsStore(s => s.backgroundPattern?.bgColour) ?? ""

    const svgColour = useOptionsStore(s => s.backgroundPattern?.svgColour)
    const svgOpacity = useOptionsStore(s => s.backgroundPattern?.svgOpacity)
    const isTarget = svgColour == colour && svgOpacity == opacity

    return <button onClick={onClick} class='relative shadow rounded outline-primary m-1' style={{ backgroundColor }}
        data-target={colour == _colour && opacity == _opacity}>
        <div class="w-10 h-10 m-1 rounded-sm" style={{ backgroundColor: colour, opacity }}></div>
        {isTarget && <TargetIndicator marginClass="m-2" colourClass={svgColour == colours.black ? "bg-white" : undefined} />}
    </button>
}

export function ColorRow() {
    const bgColour = useOptionsStore(s => s.backgroundPattern?.bgColour)
    const ref = useChildNavigate<HTMLDivElement>([bgColour])

    const hexs = useMemo(() => Object.values(colours).filter(c => !(c == colours.white || c == colours.black)), [])

    return <div ref={ref} class="grid grid-rows-2 grid-flow-col gap-2 p-2 overflow-x-scroll" tabIndex={-1}>
        {hexs.map(hex => <Colour colour={hex} />)}
    </div>
}

function Colour({ colour }: { colour: string }) {
    const onClick = () => useOptionsStore.getState().setColour(colour)

    const bgColour = useOptionsStore(s => s.backgroundPattern?.bgColour)
    const isTarget = bgColour == colour

    return <button data-target={isTarget} onClick={onClick} class="relative in w-24 h-24 rounded outline-primary" style={{ backgroundColor: colour }}>
        {isTarget && <TargetIndicator isLarge useOutline />}
    </button>
}

export function TargetIndicator(props: { isLarge?: boolean, colourClass?: string, marginClass?: string, useOutline?: boolean }) {
    return <div class={join(
        "absolute left-0 top-0 rounded-full",
        props.isLarge ? "w-3 h-3" : "w-2 h-2",
        props.useOutline && "border-2 border-white box-content",
        props.colourClass ?? "bg-gray-700",
        props.marginClass ?? "m-1",
    )}></div>
}
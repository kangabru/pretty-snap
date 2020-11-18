import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { quickPatterns, urls } from '../../constants';
import { BackgroundPattern, PatternPreset } from '../../types';
import useOptionsStore from '../stores/options';
import { getRandomItem, join, srcToUrlSvg, useChildNavigate } from '../utils';
import colours from './pattern-colours';
import patterns, { SvgPatternCallback } from './pattern-svgs';
import { QuickPreset, QuickPresets, RandButton } from './quick-presets';

export default function PatternSelector() {
    return <div class="space-y-2">
        <div class="flex flex-col md:flex-row-reverse justify-between items-center space-y-3 md:space-y-0 md:space-x-3">
            <QuickPatterns />
            <PatternColours />
        </div>
        <Patterns />
        <ColorRow />
        <p class="text-gray-800 text-center pt-3">Patterns by <a class="link" href={urls.patterns} target="blank">Hero Patterns</a></p>
    </div>
}

function getRandomPattern(): BackgroundPattern {
    const getSrc = getRandomItem(Object.values(patterns))

    const { white, black, ..._colours } = colours
    const bgColour = getRandomItem(Object.values(_colours))
    const svgColour = getRandomItem([white, black])
    const svgOpacity = getRandomItem(svgColour == white ? [0.5, 0.75, 1] : [0.25, 0.5, 0.75])
    return { getSrc, bgColour, svgColour, svgOpacity }
}

function QuickPatterns() {
    const random = () => useOptionsStore.getState().setPattern(getRandomPattern())
    const pattern = useOptionsStore(s => s.backgroundPattern)
    return <QuickPresets focusArgs={[pattern]}>
        {...quickPatterns.map(qs => <QuickPattern {...qs} />)}
        <RandButton onClick={random} />
    </QuickPresets>
}

function QuickPattern(pattern: PatternPreset) {
    const { getSrc, bgColour, svgColour, svgOpacity } = pattern
    const onClick = () => useOptionsStore.getState().setPattern(pattern)

    const c = useOptionsStore(s => s.backgroundPattern)
    const isTarget = c?.getSrc == getSrc && c?.bgColour == bgColour && c.svgColour == svgColour && c.svgOpacity == svgOpacity

    return <QuickPreset onClick={onClick} target={isTarget} style={{
        backgroundColor: bgColour,
        backgroundPosition: "center",
        backgroundSize: `${pattern.sizeRem}rem`,
        backgroundImage: srcToUrlSvg(getSrc({ svgColour, svgOpacity })),
    }} />
}

function PatternColours() {
    const colour = useOptionsStore(s => s.backgroundPattern?.svgColour)
    const opacity = useOptionsStore(s => s.backgroundPattern?.svgOpacity)
    const ref = useChildNavigate<HTMLDivElement>([colour, opacity])

    return <div ref={ref} class="row flex-wrap space-x-2">
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

    return <button onClick={onClick} class='relative shadow rounded outline-primary' style={{ backgroundColor }}
        data-target={colour == _colour && opacity == _opacity}>
        <div class="w-10 h-10 m-1 rounded-sm" style={{ backgroundColor: colour, opacity }}></div>
        {isTarget && <TargetIndicator marginClass="m-2" colourClass={svgColour == colours.black ? "bg-white" : undefined} />}
    </button>
}

function Patterns() {
    const getSrc = useOptionsStore(s => s.backgroundPattern?.getSrc)
    const ref = useChildNavigate<HTMLDivElement>([getSrc])

    return <div ref={ref} class="grid grid-rows-1 grid-flow-col gap-2 py-2 overflow-x-scroll" tabIndex={-1}>
        <Pattern getSrc={patterns.bubbles} />
        <Pattern getSrc={patterns.circlesOverlap} />
        <Pattern getSrc={patterns.polka} />
        <Pattern getSrc={patterns.random} />
        <Pattern getSrc={patterns.ticTacTeo} />
        <Pattern getSrc={patterns.wiggle} />
        <Pattern getSrc={patterns.yyy} />
        <Pattern getSrc={patterns.anchors} />
        <Pattern getSrc={patterns.circuit} />
        <Pattern getSrc={patterns.stripes} />
        <Pattern getSrc={patterns.triangles} />
        <Pattern getSrc={patterns.squares} />
        <Pattern getSrc={patterns.waves} />
        <Pattern getSrc={patterns.crosses} />
    </div>
}

function Pattern({ getSrc }: { getSrc: SvgPatternCallback }) {
    const bg = useOptionsStore(s => s.backgroundPattern) ?? { svgColour: colours.black, svgOpacity: 0.25, bgColour: colours.orange200 }
    const onClick = () => useOptionsStore.getState().setPatternSrc(getSrc)
    const backgroundImage = bg ? srcToUrlSvg(getSrc(bg)) : ""

    const currentGetSrc = useOptionsStore(s => s.backgroundPattern?.getSrc)
    const isTarget = getSrc == currentGetSrc

    return <button data-target={isTarget} onClick={onClick} class="relative w-24 h-24 rounded outline-primary" style={{ backgroundColor: bg?.bgColour ?? "black" }}>
        <div class="absolute inset-0 bg-repeat" style={{ backgroundImage }} />
        {isTarget && <TargetIndicator isLarge useOutline />}
    </button>
}

function ColorRow() {
    const bgColour = useOptionsStore(s => s.backgroundPattern?.bgColour)
    const ref = useChildNavigate<HTMLDivElement>([bgColour])

    const hexs = useMemo(() => Object.values(colours).filter(c => !(c == colours.white || c == colours.black)), [])

    return <div ref={ref} class="grid grid-rows-2 grid-flow-col gap-2 py-2 overflow-x-scroll" tabIndex={-1}>
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

function TargetIndicator(props: { isLarge?: boolean, colourClass?: string, marginClass?: string, useOutline?: boolean }) {
    return <div class={join(
        "absolute left-0 top-0 rounded-full",
        props.isLarge ? "w-3 h-3" : "w-2 h-2",
        props.useOutline && "border-2 border-white box-content",
        props.colourClass ?? "bg-gray-700",
        props.marginClass ?? "m-1",
    )}></div>
}
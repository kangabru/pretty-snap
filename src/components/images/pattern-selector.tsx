import { h } from 'preact';
import { quickPatterns } from '../../constants';
import { PatternPreset } from '../../types';
import useOptionsStore from '../stores/options';
import { srcToUrlSvg, useChildNavigate } from '../utils';
import * as colours from './pattern-colours';
import * as patterns from './pattern-svgs';
import { QuickPreset, QuickPresets } from './quick-presets';

export default function PatternSelector() {
    return <div class="space-y-2">
        <div class="flex flex-col md:flex-row-reverse justify-between items-center space-y-3 md:space-y-0 md:space-x-3">
            <QuickPatterns />
            <PatternColours />
        </div>
        <Patterns />
        <ColorRow />
    </div>
}

function QuickPatterns() {
    return <QuickPresets>{quickPatterns.map(qs => <QuickPattern {...qs} />)}</QuickPresets>
}

function QuickPattern(pattern: PatternPreset) {
    const { getSrc, bgColour, svgColour, svgOpacity } = pattern
    const onClick = () => useOptionsStore.getState().setPattern(pattern)
    return <QuickPreset onClick={onClick} style={{
        backgroundColor: bgColour,
        backgroundPosition: "center",
        backgroundSize: `${pattern.sizeRem}rem`,
        backgroundImage: srcToUrlSvg(getSrc({ svgColour, svgOpacity })),
    }} />
}

function PatternColours() {
    const ref = useChildNavigate<HTMLDivElement>()
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
    const onClick = () => useOptionsStore.getState().setPatternColour(colour, opacity)
    const backgroundColor = useOptionsStore(s => s.backgroundPattern?.bgColour) ?? ""
    return <button onClick={onClick} class='shadow rounded outline-primary' style={{ backgroundColor }}>
        <div class="w-10 h-10 m-1 rounded-sm" style={{ backgroundColor: colour, opacity }}></div>
    </button>
}

function Patterns() {
    const ref = useChildNavigate<HTMLDivElement>()
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

function Pattern({ getSrc }: { getSrc: patterns.SvgPatternCallback }) {
    const bg = useOptionsStore(s => s.backgroundPattern) ?? { svgColour: colours.black, svgOpacity: 0.25, bgColour: colours.orange200 }
    const onClick = () => useOptionsStore.getState().setPatternSrc(getSrc)
    const backgroundImage = bg ? srcToUrlSvg(getSrc(bg)) : ""
    return <button onClick={onClick} class="relative w-24 h-24 rounded outline-primary" style={{ backgroundColor: bg?.bgColour ?? "black" }}>
        <div class="absolute inset-0 bg-repeat" style={{ backgroundImage }} />
    </button>
}

function ColorRow() {
    const ref = useChildNavigate<HTMLDivElement>()
    return <div ref={ref} class="grid grid-rows-2 grid-flow-col gap-2 py-2 overflow-x-scroll" tabIndex={-1}>
        <Colour colour={colours.red200} />
        <Colour colour={colours.teal200} />
        <Colour colour={colours.red400} />
        <Colour colour={colours.teal400} />
        <Colour colour={colours.red600} />
        <Colour colour={colours.teal600} />
        <Colour colour={colours.red800} />
        <Colour colour={colours.teal800} />
        <Colour colour={colours.orange200} />
        <Colour colour={colours.blue200} />
        <Colour colour={colours.orange400} />
        <Colour colour={colours.blue400} />
        <Colour colour={colours.orange600} />
        <Colour colour={colours.blue600} />
        <Colour colour={colours.orange800} />
        <Colour colour={colours.blue800} />
        <Colour colour={colours.yellow200} />
        <Colour colour={colours.indigo200} />
        <Colour colour={colours.yellow400} />
        <Colour colour={colours.indigo400} />
        <Colour colour={colours.yellow600} />
        <Colour colour={colours.indigo600} />
        <Colour colour={colours.yellow800} />
        <Colour colour={colours.indigo800} />
        <Colour colour={colours.green200} />
        <Colour colour={colours.purple200} />
        <Colour colour={colours.green400} />
        <Colour colour={colours.purple400} />
        <Colour colour={colours.green600} />
        <Colour colour={colours.purple600} />
        <Colour colour={colours.green800} />
        <Colour colour={colours.purple800} />
        <Colour colour={colours.pink200} />
        <Colour colour={colours.gray200} />
        <Colour colour={colours.pink400} />
        <Colour colour={colours.gray400} />
        <Colour colour={colours.pink600} />
        <Colour colour={colours.gray600} />
        <Colour colour={colours.pink800} />
        <Colour colour={colours.gray800} />
    </div>
}

function Colour({ colour }: { colour: string }) {
    const onClick = () => useOptionsStore.getState().setColour(colour)
    return <button onClick={onClick} class="w-24 h-24 rounded outline-primary" style={{ backgroundColor: colour }} />
}

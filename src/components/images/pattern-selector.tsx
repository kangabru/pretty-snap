import { Fragment, h } from 'preact';
import useOptionsStore from '../stores/options';
import { join, srcToUrlSvg } from '../utils';
import * as colours from './pattern-colours';
import * as patterns from './pattern-svgs';

export default function PatternSelector() {
    return <Fragment>
        <PatternRow />
        <ColorRow />
    </Fragment>
}

function ColorRow() {
    return <div class="grid grid-rows-2 grid-flow-col gap-2 py-2 overflow-x-scroll">
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
    return <button onClick={onClick} class="w-32 h-32 rounded outline-primary" style={{ backgroundColor: colour }} />
}

function PatternRow() {
    return <div class="space-y-2">
        <PatternColours />
        <Patterns />
    </div>
}

function Patterns() {
    return <div class="row flex-wrap space-x-2">
        <Pattern getSrc={patterns.bubbles} />
        <Pattern getSrc={patterns.bubbles} />
        <Pattern getSrc={patterns.bubbles} />
        <Pattern getSrc={patterns.bubbles} />
        <Pattern getSrc={patterns.bubbles} />
    </div>
}

function Pattern({ getSrc }: { getSrc: patterns.SvgPatternCallback }) {
    const bg = useOptionsStore(s => s.backgroundPattern)
    const onClick = () => useOptionsStore.getState().setPattern(getSrc)
    return <button onClick={onClick} class="relative w-24 h-24 rounded outline-primary" style={{ backgroundColor: bg?.bgColour ?? "" }}>
        <PatternSvg getSrc={getSrc} />
    </button>
}

function PatternColours() {
    return <div class="row flex-wrap space-x-2">
        <PatternColor colour={colours.white} opacity={0.5} />
        <PatternColor colour={colours.white} opacity={0.75} />
        <PatternColor colour={colours.white} opacity={1} />
        <PatternColor colour={colours.black} opacity={0.5} />
        <PatternColor colour={colours.black} opacity={0.75} />
        <PatternColor colour={colours.black} opacity={1} />
    </div>
}

function PatternColor({ colour, opacity }: { colour: string, opacity: number }) {
    const onClick = () => useOptionsStore.getState().setPatternColour(colour, opacity)
    const backgroundColor = useOptionsStore(s => s.backgroundPattern?.bgColour) ?? ""
    return <button onClick={onClick} class='shadow rounded outline-primary' style={{ backgroundColor }}>
        <div class="w-6 h-6 m-1 rounded-sm" style={{ backgroundColor: colour, opacity }}></div>
    </button>
}

export function PatternSvg({ getSrc }: { getSrc: patterns.SvgPatternCallback }) {
    const bg = useOptionsStore(s => s.backgroundPattern)
    const backgroundImage = srcToUrlSvg(bg ? getSrc(bg) : "")
    return <div class="absolute inset-0" style={{ backgroundImage }} />
}

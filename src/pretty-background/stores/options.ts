import create, { GetState, SetState } from "zustand"
import colours from "../data/colours"
import patterns, { SvgPatternCallback } from "../data/patterns"
import { PADDING_PERC_INIT, randomPattern } from "../misc/constants"
import { BackgroundImage, BackgroundPattern, Position, Settings } from "../misc/types"

type OptionsStore = Settings & {
    setImage: (image: BackgroundImage) => void
    setPattern: (pattern: BackgroundPattern) => void
    setColour: (colour: string) => void
    setPatternSrc: (getSrc: SvgPatternCallback) => void
    setPatternColour: (colour: string, opacity: number) => void
}

/** zustand state for state management  */
const useOptionsStore = create<OptionsStore>((set, get) => ({
    paddingPerc: PADDING_PERC_INIT,
    position: Position.Bottom,

    // backgroundImage: randomSearch,
    backgroundPattern: randomPattern,

    setImage: (backgroundImage: BackgroundImage) => set({ backgroundPattern: undefined, backgroundImage }),
    setPattern: (backgroundPattern: BackgroundPattern) => updatePattern(set, get, backgroundPattern),
    setColour: (bgColour: string) => updatePattern(set, get, { bgColour }),
    setPatternSrc: (getSrc: SvgPatternCallback) => updatePattern(set, get, { getSrc }),
    setPatternColour: (svgColour: string, svgOpacity: number) => updatePattern(set, get, { svgColour, svgOpacity }),
}))

function updatePattern(set: SetState<OptionsStore>, get: GetState<OptionsStore>, updates: Partial<BackgroundPattern>) {
    const current = get().backgroundPattern ?? { getSrc: patterns.bubbles, bgColour: colours.red200, svgColour: colours.black, svgOpacity: 1 }
    set({ backgroundImage: undefined, backgroundPattern: { ...current, ...updates } })
}

export default useOptionsStore
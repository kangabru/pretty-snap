import create from "zustand"
import { PADDING_INIT, randomSearch } from "../../constants"
import { Position } from "../../types"

type Options = {
    // Images
    backgroundSrc: string,
    imageSrc?: string, // uuid

    // Composition
    padding: number,
    position: Position,
}

/** zustand state for state management  */
const useOptionsStore = create<Options>(() => ({
    backgroundSrc: randomSearch.src,
    padding: PADDING_INIT,
    position: Position.Center,
}))

export default useOptionsStore
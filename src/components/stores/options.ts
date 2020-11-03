import create from "zustand"
import { PADDING_INIT, SRC_BG_DEFAULT } from "../../constants"
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
    backgroundSrc: SRC_BG_DEFAULT,
    padding: PADDING_INIT,
    position: Position.Center,
}))

export default useOptionsStore
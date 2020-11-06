import create from "zustand"
import { PADDING_INIT, randomSearch } from "../../constants"
import { Position, Settings } from "../../types"

/** zustand state for state management  */
const useOptionsStore = create<Settings>(() => ({
    background: { src: randomSearch.src },
    padding: PADDING_INIT,
    position: Position.Center,
}))

export default useOptionsStore
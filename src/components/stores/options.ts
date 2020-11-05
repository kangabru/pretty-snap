import create from "zustand"
import { PADDING_INIT, randomSearch } from "../../constants"
import { Position, SettingsStore } from "../../types"

/** zustand state for state management  */
const useOptionsStore = create<SettingsStore>(() => ({
    background: { src: randomSearch.src },
    padding: PADDING_INIT,
    position: Position.Center,
}))

export default useOptionsStore
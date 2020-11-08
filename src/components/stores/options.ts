import create from "zustand"
import { PADDING_INIT, randomSearch } from "../../constants"
import { BackgroundImage, Position, Settings } from "../../types"

type OptionsStore = Settings & {
    setImage: (background: BackgroundImage) => void
    setColour: (src: string) => void
    setPattern: (src: string) => void
}

/** zustand state for state management  */
const useOptionsStore = create<OptionsStore>((set, get) => ({
    backgroundImage: randomSearch,
    padding: PADDING_INIT,
    position: Position.Center,

    setImage: (backgroundImage: BackgroundImage) => {
        set({ backgroundPattern: undefined, backgroundImage })
    },
    setColour: (classes: string) => {
        const pattern = get().backgroundPattern
        set({ backgroundImage: undefined, backgroundPattern: { classes, src: pattern?.src ?? "" } })
    },
    setPattern: (src: string) => {
        const pattern = get().backgroundPattern
        set({ backgroundImage: undefined, backgroundPattern: { src, classes: pattern?.classes ?? "" } })
    },
}))

export default useOptionsStore
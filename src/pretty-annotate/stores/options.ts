import create from "zustand"
import { ForegroundImage } from "../../common/misc/types"

type OptionsStore = {
    image?: ForegroundImage,
}

/** zustand state for state management  */
const useOptionsStore = create<OptionsStore>(() => ({
    // init state
}))

export default useOptionsStore
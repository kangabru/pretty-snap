import create from "zustand"
import { ForegroundImage } from "../../common/misc/types"

type OptionsStore = {
    image?: ForegroundImage,
}

/** zustand state for state management  */
const useAnnotateStore = create<OptionsStore>(() => ({
    // init state
}))

export default useAnnotateStore
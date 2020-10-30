import create from "zustand"
import { IMG_PADDING_DEFAULT, SRC_BG_DEFAULT } from "../constants"

type Options = {
    backgroundSrc: string,
    imageSrc?: string, // uuid
    padding: number,
    searchTerm?: string,
}

/** zustand state for state management  */
const useStore = create<Options>(() => ({
    backgroundSrc: SRC_BG_DEFAULT,
    padding: IMG_PADDING_DEFAULT,
} as Options))

export default useStore
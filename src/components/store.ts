import create from "zustand"
import { PADDING_INIT, SRC_BG_DEFAULT } from "../constants"

export enum Position { Center, Top, Left, Right, Bottom }

type Options = {
    // Images
    backgroundSrc: string,
    imageSrc?: string, // uuid

    // Search
    isSeaching?: boolean,
    searchTerm?: string,
    searchPage: number,

    // Composition
    padding: number,
    position: Position,
}

/** zustand state for state management  */
const useStore = create<Options>(() => ({
    backgroundSrc: SRC_BG_DEFAULT,
    searchPage: 1,
    padding: PADDING_INIT,
    position: Position.Center,
}))

export default useStore
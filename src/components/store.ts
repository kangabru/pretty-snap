import create from "zustand"
import { IMG_PADDING_DEFAULT, SRC_BG_DEFAULT } from "../constants"

export enum Position { Center, Left, Top, Right, Bottom }

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
    padding: IMG_PADDING_DEFAULT,
    position: Position.Center,
}))

export default useStore
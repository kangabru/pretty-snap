import { Bounds } from "../../misc/types"
import useAnnotateStore from "../../stores/annotation"

export function editAnnotation(id: string | undefined) {
    if (id) useAnnotateStore.getState().edit(id)
}

export function editOnClick(id: string | undefined) {
    return () => editAnnotation(id)
}

/** Converts negative bounds into positive one */
export function absBounds({ left, top, width, height }: Bounds): Bounds {
    return {
        left: Math.min(left, left + width),
        top: Math.min(top, top + height),
        width: Math.abs(width),
        height: Math.abs(height),
    }
}
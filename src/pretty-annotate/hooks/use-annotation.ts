import { useCallback } from "preact/hooks"
import { AnnotationAny } from "../misc/types"
import useAnnotateStore from "../stores/annotation"

/** Returns the current edit ID and annotation object if the user has selected an element to edit. */
export default function useEditingAnnotation(): [string | undefined, AnnotationAny | undefined] {
    const editId = useAnnotateStore(s => s.editId)
    const annotation = useAnnotateStore(useCallback(s => s.index[editId as string], [editId]))
    return [editId, annotation]
}

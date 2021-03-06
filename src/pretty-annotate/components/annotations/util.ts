import useAnnotateStore from "../../stores/annotation"

export function editAnnotation(id: string | undefined) {
    if (id) useAnnotateStore.getState().edit(id)
}

export function editAnnotationOnClick(id: string | undefined) {
    return () => editAnnotation(id)
}
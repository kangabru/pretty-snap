import { Bounds } from "../components/compositor/resizer"

export enum EditType { Add, Edit, Delete }

export enum Style { Box, Line, Arrow, Count }
export type StyleData<S extends StyleDataKeys> = StyleDataMap[S]

export type Annotation<S extends StyleDataKeys> = {
    style: Style,
    data: StyleData<S>,
}

export type AnnotationItem<S extends StyleDataKeys> = Annotation<S> & {
    id: string,
    type: EditType,
}

export type StyleDataKeys = keyof StyleDataMap
type StyleDataMap = {
    [Style.Box]: Bounds & { dashed: boolean },
    [Style.Line]: Bounds & { dashed: boolean },
    [Style.Arrow]: Bounds & { dashed: boolean },
    [Style.Count]: { value: number },
}
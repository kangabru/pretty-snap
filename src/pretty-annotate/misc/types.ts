export type Size = { width: number, height: number }
export type Position = { left: number, top: number }
export type Bounds = Size & Position & { negX: boolean, negY: boolean }

export enum EditType { Add, Edit, Delete }

export enum Style { Box, Line, Arrow, Counter }
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
    [Style.Counter]: Position & { count: number },
}
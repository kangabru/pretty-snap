export type Size = { width: number, height: number }
export type Position = { left: number, top: number }
export type Bounds = Size & Position & { negX: boolean, negY: boolean }

export enum EditType { Add, Edit, Delete }

export enum Style { Box, Line, Arrow, Counter }
export type StyleOptions = { type: Style, dashed: boolean, count: number, colour: string }


export type AnnotationItem<S extends Style> = Annotation<S>

export type AnnotationAny = StyleOptions & Partial<Bounds>
export type Annotation<S extends Style> = StyleOptions & StyleData[S]
export type StyleData = {
    [Style.Box]: Bounds,
    [Style.Line]: Bounds,
    [Style.Arrow]: Bounds,
    [Style.Counter]: Position,
}
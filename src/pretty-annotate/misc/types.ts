export type Size = { width: number, height: number }
export type Position = { left: number, top: number }
export type Bounds = Size & Position & { negX: boolean, negY: boolean }

export enum Style { Box, Line, Arrow, Counter, Text }
export type StyleOptions = { id?: string, type: Style, dashed: boolean, count: number, colour: string }

export type AnnotationItem<S extends Style> = Annotation<S>

export type AnnotationAny = StyleOptions & Partial<Bounds & { text: string, allowEvents?: boolean }>
export type Annotation<S extends Style> = StyleOptions & StyleData[S]
export type StyleData = {
    [Style.Box]: Bounds,
    [Style.Line]: Bounds,
    [Style.Arrow]: Bounds,
    [Style.Text]: Position & { text?: string },
    [Style.Counter]: Position,
}
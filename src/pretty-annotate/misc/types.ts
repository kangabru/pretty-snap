export type Size = { width: number, height: number }
export type Position = { left: number, top: number }
export type Bounds = Size & Position

export enum Shape { Box, Ellipse, Bracket, Arrow, Line, Counter, Text, Mouse }
export enum ShapeStyle { Outline, OutlineDashed, Solid, Transparent }

export type StyleOptions = { id?: string, shape: Shape, color: ColorStyle, shapeStyle: ShapeStyle, count: number }
export type ColorStyle = { color: string, useDarkText?: boolean }

export type Annotation<S extends Shape> = StyleOptions & StyleData[S]
export type AnnotationAny = StyleOptions & Partial<Bounds & { text: string, allowEvents: boolean }>

export type StyleData = {
    [Shape.Mouse]: never,
    [Shape.Box]: Bounds,
    [Shape.Ellipse]: Bounds,
    [Shape.Line]: Bounds,
    [Shape.Arrow]: Bounds,
    [Shape.Bracket]: Bounds,
    [Shape.Text]: Position & { text?: string },
    [Shape.Counter]: Position,
}

export type SupportedStyle = { canUseLine?: boolean, canUseFill?: boolean }
export const supportedStyles: { [_: number]: SupportedStyle } = {
    [Shape.Box]: { canUseLine: true, canUseFill: true },
    [Shape.Ellipse]: { canUseLine: true, canUseFill: true },
    [Shape.Line]: { canUseLine: true },
    [Shape.Arrow]: { canUseLine: true },
    [Shape.Bracket]: { canUseLine: true },
    [Shape.Text]: {},
    [Shape.Counter]: {},
}
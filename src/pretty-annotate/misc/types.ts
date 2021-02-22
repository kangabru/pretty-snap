export type Size = { width: number, height: number }
export type Position = { left: number, top: number }
export type Bounds = Size & Position & { negX: boolean, negY: boolean }

export enum Shape { Box, Ellipse, Line, Arrow, Counter, Text }
export type StyleOptions = { id?: string, shape: Shape, count: number, color: ColorStyle, style: ShapeStyle }
export type ColorStyle = { color: string, useDarkText?: boolean }
export type ShapeStyle = { dashed?: boolean, fillOpacity?: number }

export type AnnotationItem<S extends Shape> = Annotation<S>

export type AnnotationAny = StyleOptions & Partial<Bounds & { text: string, allowEvents?: boolean }>
export type Annotation<S extends Shape> = StyleOptions & StyleData[S]

export type StyleData = {
    [Shape.Box]: Bounds,
    [Shape.Ellipse]: Bounds,
    [Shape.Line]: Bounds,
    [Shape.Arrow]: Bounds,
    [Shape.Text]: Position & { text?: string },
    [Shape.Counter]: Position,
}

export type SupportedStyle = { line?: boolean, fill?: boolean }
export const supportedStyles: { [_: number]: SupportedStyle } = {
    [Shape.Box]: { line: true, fill: true },
    [Shape.Ellipse]: { line: true, fill: true },
    [Shape.Line]: { line: true },
    [Shape.Arrow]: { line: true },
    [Shape.Text]: {},
    [Shape.Counter]: {},
}
export enum AnnotateType { Box, Line, Arrow, Count }

export type Annotation = {
    id: string,
    type?: AnnotateType,
    wasEdit?: boolean, // add or edit
    data: any,
}

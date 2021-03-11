import { Fragment, h } from 'preact';
import { CssClass } from '../../../common/misc/types';
import { MouseFunc } from '../../hooks/use-move';
import { Annotation, AnnotationAny, Bounds, Shape } from '../../misc/types';
import Box, { BoxSelectableArea } from '../annotations/box';
import Arrow from './arrow';
import Bracket from './bracket';
import Counter, { CounterSelectableArea } from './counter';
import Ellipse from './ellipse';
import Line, { LineSelectableArea } from './line';
import Text, { TextSelectableArea } from './text';

export default function GenericAnnotation(props: AnnotationAny) {
    return <>
        {props.shape == Shape.Box && <Box {...props as Annotation<Shape.Box>} />}
        {props.shape == Shape.Ellipse && <Ellipse {...props as Annotation<Shape.Ellipse>} />}

        {props.shape == Shape.Line && <Line {...props as Annotation<Shape.Line>} />}
        {props.shape == Shape.Arrow && <Arrow {...props as Annotation<Shape.Arrow>} />}
        {props.shape == Shape.Bracket && <Bracket {...props as Annotation<Shape.Bracket>} />}

        {props.shape == Shape.Counter && <Counter {...props as Annotation<Shape.Counter>} />}
        {props.shape == Shape.Text && <Text {...props as Annotation<Shape.Text>} />}
    </>
}

export type SelectableAreaProps = CssClass & {
    annotation: AnnotationAny,
    events?: {
        onClick?: MouseFunc, onMouseDown?: MouseFunc,
        onMouseMove?: MouseFunc, onMouseUp?: MouseFunc,
    }
}

export function GenericSelectableArea(props: SelectableAreaProps) {
    const shape = props.annotation.shape
    return <>
        {shape == Shape.Box && <BoxSelectableArea {...props} />}
        {shape == Shape.Ellipse && <BoxSelectableArea {...props} />}

        {shape == Shape.Line && <LineSelectableArea {...props} />}
        {shape == Shape.Arrow && <LineSelectableArea {...props} />}
        {shape == Shape.Bracket && <LineSelectableArea {...props} />}

        {shape == Shape.Counter && <CounterSelectableArea {...props} />}
        {shape == Shape.Text && <TextSelectableArea {...props} />}
    </>
}

type ResizeConfig = {
    top?: boolean, left?: boolean,
    right?: boolean, bottom?: boolean,
    topLeft?: boolean, topRight?: boolean,
    bottomLeft?: boolean, bottomRight?: boolean,
}

export function GetResizeUiConfig(shape: Shape, bounds: Bounds): ResizeConfig | undefined {
    switch (shape) {
        case Shape.Box:
        case Shape.Ellipse:
            return { top: true, left: true, right: true, bottom: true, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true }

        case Shape.Line:
        case Shape.Arrow:
        case Shape.Bracket:
            // eslint-disable-next-line no-case-declarations
            const topLeftBottomRight = Math.sign(bounds.width) == Math.sign(bounds.height)
            return {
                topLeft: topLeftBottomRight,
                bottomRight: topLeftBottomRight,
                topRight: !topLeftBottomRight,
                bottomLeft: !topLeftBottomRight,
            }
    }
}

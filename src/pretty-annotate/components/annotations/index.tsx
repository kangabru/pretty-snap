import { Fragment, h } from 'preact';
import { CssClass } from '../../../common/misc/types';
import { Annotation, AnnotationAny, Bounds, Shape } from '../../misc/types';
import Box, { BoxSelectableArea } from '../annotations/box';
import { MouseFunc } from '../compositor/move-pane';
import { ResizeConfig } from '../compositor/mover';
import Arrow from './arrow';
import Bracket from './bracket';
import Counter from './counter';
import Ellipse from './ellipse';
import Line, { LineSelectableArea } from './line';
import Text from './text';

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

export type SelectableAreaProps = { bounds: Bounds, shape: Shape } & CssClass & {
    onClick?: MouseFunc, onMouseDown?: MouseFunc, onMouseMove?: MouseFunc, onMouseUp?: MouseFunc,
}

export function GenericSelectableArea(props: SelectableAreaProps) {
    return <>
        {props.shape == Shape.Box && <BoxSelectableArea {...props} />}
        {props.shape == Shape.Ellipse && <BoxSelectableArea {...props} />}

        {props.shape == Shape.Line && <LineSelectableArea {...props} />}
        {props.shape == Shape.Arrow && <LineSelectableArea {...props} />}
        {props.shape == Shape.Bracket && <LineSelectableArea {...props} />}

        {/* {props.shape == Shape.Counter && <Counter {...props as Annotation<Shape.Counter>} />} */}
        {/* {props.shape == Shape.Text && <Text {...props as Annotation<Shape.Text>} />} */}
    </>
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
            const topLeftBottomRight = bounds.negX == bounds.negY
            return {
                topLeft: topLeftBottomRight,
                bottomRight: topLeftBottomRight,
                topRight: !topLeftBottomRight,
                bottomLeft: !topLeftBottomRight,
            }
    }
}
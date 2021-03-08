import { Fragment, h } from 'preact';
import { Annotation, AnnotationAny, Bounds, Shape } from '../../misc/types';
import Box, { BoxSelectableArea } from '../annotations/box';
import Arrow from './arrow';
import Bracket from './bracket';
import Counter from './counter';
import Ellipse from './ellipse';
import Line from './line';
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

export type SelectableAreaProps = Bounds & { shape: Shape, onClick: (e: MouseEvent) => void }

export function GenericSelectableArea(props: SelectableAreaProps) {
    return <>
        {props.shape == Shape.Box && <BoxSelectableArea {...props} />}
        {props.shape == Shape.Ellipse && <BoxSelectableArea {...props} />}

        {/* {props.shape == Shape.Line && <LineMovableArea {...props} />} */}
        {/* {props.shape == Shape.Arrow && <LineMovableArea {...props} />} */}
        {/* {props.shape == Shape.Bracket && <LineMovableArea {...props} />} */}

        {/* {props.shape == Shape.Counter && <Counter {...props as Annotation<Shape.Counter>} />} */}
        {/* {props.shape == Shape.Text && <Text {...props as Annotation<Shape.Text>} />} */}
    </>
}
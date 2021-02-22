import { Fragment, h } from 'preact';
import { Annotation, AnnotationAny, Shape } from '../../misc/types';
import Box from '../annotations/box';
import Arrow from './arrow';
import Ellipse from './ellipse';
import Counter from './counter';
import Line from './line';
import Text from './text';

export default function GenericAnnotation(props: AnnotationAny) {
    return <>
        {props.shape == Shape.Box && <Box {...props as Annotation<Shape.Box>} />}
        {props.shape == Shape.Ellipse && <Ellipse {...props as Annotation<Shape.Ellipse>} />}
        {props.shape == Shape.Line && <Line {...props as Annotation<Shape.Line>} />}
        {props.shape == Shape.Arrow && <Arrow {...props as Annotation<Shape.Arrow>} />}
        {props.shape == Shape.Counter && <Counter {...props as Annotation<Shape.Counter>} />}
        {props.shape == Shape.Text && <Text {...props as Annotation<Shape.Text>} />}
    </>
}
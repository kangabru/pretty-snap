import { Fragment, h } from 'preact';
import { Annotation, AnnotationAny, Style } from '../../misc/types';
import Box from '../annotations/box';
import Arrow from './arrow';
import Counter from './counter';
import Line from './line';
import Text from './text';

export default function GenericAnnotation(props: AnnotationAny) {
    return <>
        {props.type == Style.Box && <Box {...props as Annotation<Style.Box>} />}
        {props.type == Style.Line && <Line {...props as Annotation<Style.Line>} />}
        {props.type == Style.Arrow && <Arrow {...props as Annotation<Style.Arrow>} />}
        {props.type == Style.Counter && <Counter {...props as Annotation<Style.Counter>} />}
        {props.type == Style.Text && <Text {...props as Annotation<Style.Text>} />}
    </>
}
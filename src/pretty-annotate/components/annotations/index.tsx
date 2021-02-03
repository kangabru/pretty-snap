import { Fragment, h } from 'preact';
import { Style, StyleData, StyleDataKeys } from '../../misc/types';
import Box from '../annotations/box';
import Arrow from './arrow';
import Counter from './counter';
import Line from './line';

export default function GenericAnnotation<S extends StyleDataKeys>({ style, data }: { style: S, data: StyleData<S> }) {
    return <>
        {style == Style.Box && <Box {...data as StyleData<Style.Box>} />}
        {style == Style.Line && <Line {...data as StyleData<Style.Line>} />}
        {style == Style.Arrow && <Arrow {...data as StyleData<Style.Arrow>} />}
        {style == Style.Counter && <Counter {...data as StyleData<Style.Counter>} />}
    </>
}
import { Fragment, h } from 'preact';
import { StyleData, Style, StyleDataKeys } from '../../misc/types';
import Box from '../annotations/box';
import Line from './line';

export default function GenericAnnotation<S extends StyleDataKeys>({ style, data }: { style: S, data: StyleData<S> }) {
    return <>
        {style == Style.Box && <Box {...data as StyleData<Style.Box>} />}
        {style == Style.Line && <Line {...data as StyleData<Style.Line>} />}
    </>
}
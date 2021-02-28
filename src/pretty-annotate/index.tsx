import { Fragment, h } from 'preact';
import Advanced from './components/advanced';
import Compositor from './components/compositor';

export default function PrettyAnnotate() {
    return <>
        <Compositor />
        <Advanced />
    </>
}
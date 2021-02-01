import { Fragment, h } from 'preact';
import BackgroundControls from './controls-bg';
import CompositorViewer from './viewer';

export default function Compositor() {
    return <>
        <CompositorViewer />
        <BackgroundControls />
    </>
}
import React from 'react';
import BackgroundControls from './controls-bg';
import CompositorViewer from './viewer';

export default function Compositor() {
    return <>
        <CompositorViewer />
        <BackgroundControls />
    </>
}
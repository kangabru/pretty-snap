import { h } from 'preact';
import Controls from './controls';
import ImageRow from './images';

/** Renders the image search and select component. */
export default function ImageSelector() {
    return <section class="w-full max-w-screen-lg bg-white shadow-md p-5 space-y-3 rounded-lg">
        <Controls />
        <ImageRow />
    </section>
}

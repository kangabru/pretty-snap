import { Fragment, h } from 'preact';
import Compositor from './components/compositor';

export default function PrettyAnnotate() {
    return <>
        <Compositor />
        <Controls />
    </>
}

function Controls() {
    return <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg">
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
        <button class="bg-gray-300 w-12 h-12 rounded-md"></button>
    </section>
}

import { Fragment, h } from 'preact';

export default function PrettyAnnotate() {
    return <>
        <Viewer />
        <Controls />
    </>
}

function Viewer() {
    return <section class="bg-gray-200 w-full max-w-3xl h-96 rounded-lg">

    </section>
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

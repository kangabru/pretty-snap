import { h } from 'preact';
import { Style } from '../misc/types';
import useAnnotateStore from '../stores/annotation';

export default function Controls() {
    const undo = useAnnotateStore(s => s.undo)
    const redo = useAnnotateStore(s => s.redo)

    const setStyle = (style: Style, dashed: boolean) => () => useAnnotateStore.setState({ style, styleOptions: { dashed } })

    return <section class="hidden sm:flex justify-center flex-wrap max-w-xl w-full mx-auto">

        <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2">
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Box, false)}>
                <svg class="w-8 h-8 transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="16" height="16" rx="2" stroke="black" fill='none' stroke-width="2.75" />
                </svg>
            </button>
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Box, true)}>
                <svg class="w-8 h-8 transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="16" height="16" rx="2" stroke="black" fill='none' stroke-width="2.75" stroke-linecap="round" stroke-dasharray="3.795" stroke-dashoffset="3.795" />
                </svg>
            </button>
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Arrow, false)}>
                <svg class="w-8 h-8 transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" />
                    <line x1="6" y1="16" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" />
                    <line x1="16" y1="6" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" />
                </svg>
            </button>
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Arrow, true)}>
                <svg class="w-8 h-8 transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="-1" />
                    <line x1="6" y1="16" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" />
                    <line x1="16" y1="6" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" />
                </svg>
            </button>
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Line, false)}>
                <svg class="w-8 h-8 transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" />
                </svg>
            </button>
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Line, true)}>
                <svg class="w-8 h-8 transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="black" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="0" />
                </svg>
            </button>
            <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={setStyle(Style.Count, false)}>
                <span class="bg-black w-8 h-8 rounded-full text-white font-bold text-xl font-mono grid place-items-center">1</span>
            </button>
        </section>

        <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2">
            <button class="w-12 h-12 rounded-md grid place-items-center bg-red-400"></button>
            <button class="w-12 h-12 rounded-md grid place-items-center bg-yellow-400"></button>
            <button class="w-12 h-12 rounded-md grid place-items-center bg-green-400"></button>
            <button class="w-12 h-12 rounded-md grid place-items-center bg-blue-400"></button>
            <button class="w-12 h-12 rounded-md grid place-items-center bg-gray-800"></button>
            <button class="w-12 h-12 rounded-md grid place-items-center bg-white"></button>
        </section>

        <div className="flex">
            <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2">
                <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={undo}>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"></path></svg>
                </button>
                <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={redo}>
                    <svg class="w-6 h-6 transform rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"></path></svg>
                </button>
            </section>

            <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2">
                <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"></path></svg>
                </button>
                <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path></svg>
                </button>
            </section>
        </div>
    </section>
}
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Children, CSSClass } from '../misc/types';
import { join } from '../misc/utils';

export default function Advanced({ children, class: cls }: Children & CSSClass) {
    const [show, setShow] = useState(false)
    return <section class={join(cls, "col mx-auto w-full max-w-screen-md space-y-5")}>

        <button class={join("row pr-1 text-lg text-center rounded text-gray-500 hover:text-gray-800 hover:underline outline-primary", show && "text-gray-800")} onClick={() => setShow(!show)}>
            <svg class={join("w-6 h-6 transform rotate-0 transition-transform", show && "rotate-90")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
            <span>Advanced</span>
        </button>

        {show && children}
    </section>
}
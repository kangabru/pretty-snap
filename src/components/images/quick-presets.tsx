import { h } from 'preact';
import { CSSProperties } from 'react';
import { join } from '../utils';

/** Renders the little icons used to set predefined backgrounds */
export function QuickPresets(props: { children: JSX.Element | JSX.Element[] }) {
    return <div class="row flex-wrap justify-center pr-4">{props.children}</div>
}

export function QuickPreset(props: { title?: string, onClick: () => void, classes?: string, style?: CSSProperties }) {
    return <button onClick={props.onClick} title={props.title} style={props.style as any}
        class={join(props.classes, "w-12 h-12 m-1 -mr-4 z-0 bg-cover rounded-full shadow hover:shadow-md border-white border-2 transform hover:scale-105 outline-primary")}>
    </button>
}

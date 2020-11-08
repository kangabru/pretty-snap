import { Fragment, h } from 'preact';
import { useState } from 'react';
import useOptionsStore from '../stores/options';
import { join, srcToUrl } from '../utils';
import Controls from './controls';
import ImageRow from './images';
import * as patterns from './patterns'

enum Screen { Pattern, Image }

/** Renders the image search and select component. */
export default function BackgroundSelector() {
    const [screen, setScreen] = useState(Screen.Pattern)
    const switchScreen = (screen: Screen) => () => setScreen(screen)

    const optionClass = "flex-1 mx-5 pb-2 border-b-2 focus:outline-none transition"
    return <section class="w-full max-w-screen-lg bg-white shadow-md p-5 space-y-3 rounded-lg">

        <div class="grid grid-cols-2">
            <button onClick={switchScreen(Screen.Pattern)} class={join(optionClass, screen == Screen.Pattern ? "border-primary-light" : "border-transparent")}>Pattern</button>
            <button onClick={switchScreen(Screen.Image)} class={join(optionClass, screen == Screen.Image ? "border-primary-light" : "border-transparentn")}>Image</button>
        </div>

        {screen == Screen.Pattern && <PatternSelector />}
        {screen == Screen.Image && <ImageSelector />}
    </section>
}

function ImageSelector() {
    return <Fragment>
        <Controls />
        <ImageRow />
    </Fragment>
}

function PatternSelector() {
    return <div class="grid grid-rows-2 grid-flow-col gap-2 overflow-x-scroll">
        <Pattern svg={patterns.bubbles} />
        <Colour className="bg-red-200" />
        <Colour className="bg-teal-200" />
        <Colour className="bg-red-400" />
        <Colour className="bg-teal-400 bg-20" />
        <Colour className="bg-red-600" />
        <Colour className="bg-teal-600" />
        <Colour className="bg-red-800" />
        <Colour className="bg-teal-800" />

        <Colour className="bg-orange-200" />
        <Colour className="bg-blue-200" />
        <Colour className="bg-orange-400" />
        <Colour className="bg-blue-400" />
        <Colour className="bg-orange-600" />
        <Colour className="bg-blue-600" />
        <Colour className="bg-orange-800" />
        <Colour className="bg-blue-800" />

        <Colour className="bg-yellow-200" />
        <Colour className="bg-indigo-200" />
        <Colour className="bg-yellow-400" />
        <Colour className="bg-indigo-400" />
        <Colour className="bg-yellow-600" />
        <Colour className="bg-indigo-600" />
        <Colour className="bg-yellow-800" />
        <Colour className="bg-indigo-800" />

        <Colour className="bg-green-200" />
        <Colour className="bg-purple-200" />
        <Colour className="bg-green-400" />
        <Colour className="bg-purple-400" />
        <Colour className="bg-green-600" />
        <Colour className="bg-purple-600" />
        <Colour className="bg-green-800" />
        <Colour className="bg-purple-800" />

        <Colour className="bg-pink-200" />
        <Colour className="bg-gray-200" />
        <Colour className="bg-pink-400" />
        <Colour className="bg-gray-400" />
        <Colour className="bg-pink-600" />
        <Colour className="bg-gray-600" />
        <Colour className="bg-pink-800" />
        <Colour className="bg-gray-800" />
    </div>
}

function Colour({ className }: { className: string }) {
    const onClick = () => useOptionsStore.getState().setColour(className)
    return <button onClick={onClick} class={join("w-32 h-32 rounded text-white", className)} />
}

function Pattern({ svg }: { svg: string }) {
    const bg = useOptionsStore(s => s.backgroundPattern)
    const src = svg ?? ""
    const onClick = () => useOptionsStore.getState().setPattern(src)
    return <button onClick={onClick} class={join("w-32 h-32 rounded text-white", bg?.classes)} style={{ backgroundImage: srcToUrl(src) }} />
}
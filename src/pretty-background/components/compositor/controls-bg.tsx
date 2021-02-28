import { h } from 'preact';
import { useEffect, useState } from 'react';
import { join } from '../../../common/misc/utils';
import useUnsplashStore from '../../stores/unsplash';
import ImageSelector from '../image-selector';
import PatternSelector from '../pattern-selector';

enum Screen { Pattern, Image }

/** Combines the pattern and image controls into a single panel under the main compositor. */
export default function CompositorBackgroundControls() {
    const [screen, setScreen] = useState(Screen.Pattern)
    const switchScreen = (screen: Screen) => () => setScreen(screen)

    // Search on page load
    const [isFirstSearch, setIsFirstSearch] = useState(true)
    useEffect(() => {
        if (isFirstSearch && screen == Screen.Image) {
            useUnsplashStore.getState().search()
            setIsFirstSearch(false)
        }
    }, [screen, isFirstSearch])


    const optionClass = "flex-1 mx-5 pb-2 border-b-2 focus:underline outline-none focus:outline-none transition"
    return <section class="w-full max-w-screen-lg bg-white shadow-md p-5 space-y-3 rounded-lg">

        <div class="grid grid-cols-2">
            <button onClick={switchScreen(Screen.Pattern)} class={join(optionClass, screen == Screen.Pattern ? "border-primary-light" : "border-transparent")}>Pattern</button>
            <button onClick={switchScreen(Screen.Image)} class={join(optionClass, screen == Screen.Image ? "border-primary-light" : "border-transparentn")}>Image</button>
        </div>

        {screen == Screen.Image && <ImageSelector />}
        {screen == Screen.Pattern && <PatternSelector />}
    </section>
}


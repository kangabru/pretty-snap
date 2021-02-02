import { h } from 'preact';
import { onInputChange, useImageDrop, useImagePaste } from '../../../common/hooks/use-import';
import { ForegroundImage } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import useAnnotateStore from '../../../common/stores/options';
import Controls from '../controls';
import Editor from './editor';
import ImportDetails from './import';

/** Renders the main image composition preview component. */
export default function Compositor() {
    const setImage = (image: ForegroundImage) => useAnnotateStore.setState({ image })

    const showEditor = true // TODO image?.src != null

    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)

    return <main class="px-4 space-y-6">
        <section class="block w-full max-w-screen-md mx-auto rounded-xl overflow-hidden shadow-md">
            <div ref={dropZone} class={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                {showEditor
                    ? <Editor />
                    : <label class="cursor-pointer inline-block">
                        <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
                        <ImportDetails {...{ isDropping, isError }} />
                    </label>}
            </div>
        </section>

        <Controls />
    </main>
}

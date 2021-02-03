import React from 'react';
import { onInputChange, useImageDrop, useImagePaste } from '../../../common/hooks/use-import';
import { ForegroundImage } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import useOptionsStore from '../../stores/options';
import Controls from '../controls';
import Editor from './editor';
import ImportDetails from './import';
import Viewer from './viewer';

/** Renders the main image composition preview component. */
export default function Compositor() {
    const setImage = (image: ForegroundImage) => useOptionsStore.setState({ image })

    const showEditor = true // TODO image?.src != null

    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)

    return <main className="px-4 space-y-6">
        <section className="block w-full max-w-screen-md mx-auto rounded-xl overflow-hidden shadow-md">
            <div ref={dropZone} className={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                {showEditor
                    ? <ViewerEditor />
                    : <label className="cursor-pointer inline-block">
                        <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
                        <ImportDetails {...{ isDropping, isError }} />
                    </label>}
            </div>
        </section>

        <Controls />
    </main>
}

function ViewerEditor() {
    const isAdding = true
    return <div className="relative">
        <TempDevImage />
        <Viewer />
        {isAdding && <Editor />}
    </div>
}

function TempDevImage() {
    return <div className="bg-white w-full" >
        <div className="flex items-center justify-end p-3 bg-gray-700">
            <div className="flex space-x-4">
                <div className="bg-blue-300   w-6 h-6 rounded-full"></div>
                <div className="bg-red-300    w-6 h-6 rounded-full"></div>
                <div className="bg-yellow-300 w-6 h-6 rounded-full"></div>
            </div>
        </div>

        <div className="flex">
            <div className="hidden sm:block w-1/5 bg-gray-100 p-4 space-y-2">
                <div className="bg-gray-300 w-4/6 h-4 rounded-full"></div>
                <div className="bg-gray-300 w-2/6 h-4 rounded-full"></div>
                <div className="bg-gray-300 w-6/6 h-4 rounded-full"></div>
                <div className="h-2"></div>
                <div className="bg-gray-300 w-3/6 h-4 rounded-full"></div>
                <div className="bg-gray-300 w-5/6 h-4 rounded-full"></div>
                <div className="bg-gray-300 w-2/6 h-4 rounded-full"></div>
            </div>

            <div className="flex-1 space-y-4 p-8">
                <div className="bg-gray-200 w-5/6 h-6 rounded-full"></div>
                <div className="bg-gray-200 w-3/6 h-6 rounded-full"></div>
                <div className="bg-gray-200 w-1/6 h-6 rounded-full"></div>
                <div className="h-4"></div>
                <div className="bg-gray-200 w-3/6 h-6 rounded-full"></div>
                <div className="bg-gray-200 w-4/6 h-6 rounded-full"></div>
                <div className="bg-gray-200 w-1/6 h-6 rounded-full"></div>
                <div className="h-4"></div>
                <div className="bg-gray-200 w-1/6 h-6 rounded-full"></div>
                <div className="bg-gray-200 w-5/6 h-6 rounded-full"></div>
                <div className="bg-gray-200 w-3/6 h-6 rounded-full"></div>
            </div>
        </div>
    </div>
}
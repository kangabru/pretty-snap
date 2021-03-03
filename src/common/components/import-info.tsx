import { Fragment, h } from 'preact';
import srcDemoImage from '../../../assets/images/demo.png';
import { loadImageFromDataUrl } from '../hooks/use-import';
import { ForegroundImage } from '../misc/types';
import { join } from '../misc/utils';

type Props = { title: string | JSX.Element, isDropping: boolean, isError: boolean, setImage: (_: ForegroundImage) => void }

/** Renders the initial info section within the compositor before the user has selected an image. */
export default function ImportDetails({ title, isDropping, isError, setImage }: Props) {
    return <>
        <div class="w-full px-4 pt-4 sm:pt-8 sm:px-12 space-y-5">
            <h2 class="max-w-md mx-auto space-x-1 text-xl sm:text-3xl text-center font-open font-semibold select-none">
                {title}
            </h2>
            <div class={join("w-full max-w-lg mx-auto py-4 px-6 space-y-2 text-base text-center sm:text-lg rounded-3xl border-4 select-none",
                isDropping ? "border-solid border-orange-300" : "border-dashed hover:border-orange-300",
                isError ? "border-red-500" : "border-gray-400")}>
                <p class="font-semibold text-lg sm:text-2xl">Add a screenshot</p>
                {isError
                    ? <p class="text-red-400 font-semibold">Please use an image file!</p>
                    : <p class="max-w-sm mx-auto">Click here, paste, or drop an image</p>}
            </div>
        </div>

        <p class="text-gray-800 text-center rounded text-lg row justify-center space-x-1 my-3">
            <span>No screenshot? Try this one</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-1 w-5 h-5" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 6h6a3 3 0 0 1 3 3v10l-4 -4m8 0l-4 4" />
            </svg>
        </p>

        <DemoImageButton setImage={setImage} />
    </>
}

export function DemoImageButton({ setImage }: { setImage: (image: ForegroundImage) => void }) {
    const onClick = () => loadImageFromDataUrl(srcDemoImage).then(setImage)
    return <button class="block w-full max-w-md mx-auto pt-5 px-5 -mt-5 group  outline-none focus:outline-none" onClick={onClick}>
        <div class="transition-all duration-300 transform translate-y-5 shadow-xl hover:-translate-y-0 group-focus:-translate-y-0 hover:shadow-2xl group-focus:shadow-2xl">
            <div class="flex items-center justify-end p-2 rounded-t-lg bg-gray-700">
                <div class="flex space-x-2">
                    <div class="bg-blue-300   w-3 h-3 rounded-full"></div>
                    <div class="bg-red-300    w-3 h-3 rounded-full"></div>
                    <div class="bg-yellow-300 w-3 h-3 rounded-full"></div>
                </div>
            </div>

            <div class="flex bg-gray-200">
                <div class="w-1/3 bg-gray-100 pt-3 px-2 space-y-1">
                    <div class="bg-gray-300 w-3/6 h-2 rounded-full"></div>
                    <div class="bg-gray-300 w-1/6 h-2 rounded-full"></div>
                    <div class="bg-gray-300 w-5/6 h-2 rounded-full"></div>
                    <div class="bg-gray-300 w-2/6 h-2 rounded-full"></div>
                </div>

                <div class="flex-1 space-y-2 p-4">
                    <div class="bg-white w-5/6 h-3 rounded-full"></div>
                    <div class="bg-white w-2/6 h-3 rounded-full"></div>
                </div>
            </div>
        </div>
    </button>
}
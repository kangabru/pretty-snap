import { h } from 'preact';
import { join } from '../../../common/misc/utils';

/** Renders the initial info section within the compositor before the user has selected an image. */
export default function ImportDetails({ isDropping, isError }: { isDropping: boolean, isError: boolean }) {
    return <div className={join("p-4 sm:py-8 sm:px-12 space-y-5 bg-white")}>
        <h2 class="max-w-sm mx-auto space-x-1 text-xl sm:text-3xl text-center font-open font-semibold select-none">
            Annotate screenshots right in your browser
        </h2>
        <div class={join("w-full py-4 px-6 space-y-2 text-base text-center sm:text-lg rounded-3xl border-4 select-none",
            isDropping ? "border-solid" : "border-dashed",
            isError ? "border-red-500" : "border-gray-400")}>
            <p class="font-semibold text-lg sm:text-2xl">Get started</p>
            {isError
                ? <p class="text-red-400 font-semibold">Please use an image file!</p>
                : <p class="max-w-sm mx-auto"><b>Add a snapshot:</b> click here, paste from clipboard, or drop an image</p>}
        </div>
    </div>
}

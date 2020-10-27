import { Fragment, h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './index.css';

const IMG_BG_DEFAULT = "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="col p-5 space-y-5">
        <h1 class="text-6xl row space-x-5">
            <span>📷 Pretty Snap</span>
        </h1>
        <Image />
        <Controls />
    </div>
}

function Image() {
    const [urlImage, setUrlImage] = useState<string | null>(null)
    const [urlImageBg, setUrlImageBg] = useState(IMG_BG_DEFAULT)

    useEffect(() => {
        const onPaste = (e) => loadImageOnPaste(e).then(setUrlImage)
        document.addEventListener('paste', onPaste)
        return () => document.removeEventListener('paste', onPaste)
    }, [])

    return <section class="w-full rounded-xl bg-gray-200 shadow-lg bg-cover bg-center p-10" style={{ backgroundImage: `url('${urlImageBg}')` }}>
        <div class="bg-white shadow h-64 rounded-lg p-5">
            <div class="border-dashed border-4 border-gray-500 w-full h-full rounded-3xl col justify-center text-2xl space-y-5">
                {urlImage
                    ? <img src={urlImage} alt="Screenshot" />
                    : <Fragment>
                        <p class="font-bold">Ctrl + V</p>
                        <label class="px-2 py-2 bg-white shadow rounded-lg cursor-pointer">
                            Upload
                            <input hidden type="file" accept="image/*" onChange={e => loadImageOnChange(e).then(setUrlImage)} />
                        </label>
                    </Fragment>
                }
            </div>
        </div>
    </section>
}

function loadImageOnChange(e: Event): Promise<string> {
    return new Promise((accept, reject) => {
        var files = (e.target as HTMLInputElement)?.files
        if (files) {
            var file = files[0]
            if (file.type.match('image.*')) {
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (evt) => evt.target && accept(evt.target.result as string)
                reader.onerror = () => reject("Error reading file")
            }
        } else
            reject("No files given")
    })
}

type LocalClipboardEvent = ClipboardEvent & {
    originalEvent: ClipboardEvent
}

/** @see https://stackoverflow.com/a/15369753/3801481 */
function loadImageOnPaste(e: LocalClipboardEvent): Promise<string> {
    return new Promise((accept, reject) => {
        const clipboardData = e.clipboardData || e.originalEvent.clipboardData
        if (!clipboardData) return reject("No clipboard data")

        var items = clipboardData.items;
        var blob = null
        for (var i = 0; i < items.length; i++)
            if (items[i].type.indexOf("image") === 0)
                blob = items[i].getAsFile();

        if (blob) {
            var reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = (event) => event.target && accept(event.target.result as string)
            reader.onerror = () => reject("Error reading data")
        }
        else
            reject("No data given")
    })
}

function Controls() {
    return <div class="w-full rounded bg-gray-200 p-5 space-x-3 row justify-center">
        <input type="range" min="1" max="30" value="10"></input>
        <input type="range" min="1" max="30" value="10"></input>
        <button class="px-2 py-2 bg-white shadow rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
        <button class="px-2 py-2 bg-white shadow rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg></button>
    </div>
}
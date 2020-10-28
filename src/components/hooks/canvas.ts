import domToImage from 'dom-to-image';
import { Ref, useRef, useState } from "preact/hooks";
import { DataImage } from "./upload";

type Settings = {
    dataImage?: DataImage | undefined,
    padding: number
}

export function useDownload<T extends HTMLElement>(settings: Settings): [Ref<T>, () => void, boolean] {
    const containerRef = useRef<T>()
    const [isDownloading, setIsDownloading] = useState(false)

    const download = () => {
        const { dataImage, padding } = settings
        if (dataImage && containerRef.current) {
            setIsDownloading(true)
            domToImage.toPng(containerRef.current, {
                width: dataImage.width + 2 * padding,
                height: dataImage.height + 2 * padding,
            }).then(x => {
                setIsDownloading(false)
                downloadImage(x)
            })
        }
        else
            setIsDownloading(false)
    }

    return [containerRef, download, isDownloading]
}

function downloadImage(dataUrl: string) {
    const a = document.createElement('a')
    a.setAttribute('hidden', '1')
    a.setAttribute("href", dataUrl)
    a.setAttribute("download", "test.png")
    a.click()
    a.remove()
}
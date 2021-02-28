import { h } from 'preact';
import { onInputChange, SetImage, useImageDrop, useImagePaste } from '../hooks/use-import';
import { join } from '../misc/utils';
import ImportDetails from './import-info';

type DropZoneProps = { setImage: SetImage, title: string | JSX.Element, class?: string }

export default function DropZone(props: DropZoneProps) {
    return <DropZoneWrap {...props}>
        {importProps => <ImportDetails {...importProps} />}
    </DropZoneWrap>
}

type InnerDropZoneProps = { isDropping: boolean, isError: boolean, setImage: SetImage, title: string | JSX.Element }
type DropZoneChildren = { children: (_: InnerDropZoneProps) => JSX.Element }

export function DropZoneWrap({ title, class: cls, setImage, children }: DropZoneChildren & DropZoneProps) {
    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)
    const innerProps: InnerDropZoneProps = { title, isDropping, isError, setImage }

    return <div ref={dropZone} class={join(cls, "w-full")}>
        <label class="cursor-pointer block bg-white rounded-t-lg overflow-hidden shadow-lg outline-ring group">
            <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
            {children(innerProps)}
        </label>
    </div>
}
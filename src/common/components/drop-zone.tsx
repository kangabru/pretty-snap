import { h } from 'preact';
import { onInputChange, SetImage, useImageDrop, useImagePaste } from '../hooks/use-import';
import { ChildrenWithProps, CssClass, CssStyle } from '../misc/types';
import { join } from '../misc/utils';
import ImportDetails from './import-info';

type DropZoneProps = CssClass & { setImage: SetImage, title: string | JSX.Element, contentProps?: DropZoneContentProps }
type DropZoneContentProps = CssStyle & CssClass

export default function DropZone(props: DropZoneProps) {
    return <DropZoneContainer {...props}>
        {importProps => <ImportDetails {...importProps} />}
    </DropZoneContainer>
}

type InnerDropZoneProps = { isDropping: boolean, isError: boolean, setImage: SetImage, title: string | JSX.Element }

export function DropZoneContainer({ contentProps, ...props }: ChildrenWithProps<InnerDropZoneProps> & DropZoneProps) {
    const { title, setImage, children } = props

    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)
    const innerProps: InnerDropZoneProps = { title, isDropping, isError, setImage }

    return <div ref={dropZone} class={join(props.class, "w-full")}>
        <label style={contentProps?.style}
            class={join(contentProps?.class, "cursor-pointer block overflow-hidden shadow-lg group")}>
            <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
            {children(innerProps)}
        </label>
    </div>
}
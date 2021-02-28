import { Fragment, h, JSX } from 'preact';
import { urls } from '../constants';
import { ExportOptions, Exports, ExportState } from '../hooks/use-export';
import { Children, CssClass, CssStyle } from '../misc/types';
import { join } from '../misc/utils';

export function ExportError({ copy: { state: copyState }, download: { state: downloadState } }: Exports) {
    const hasError = copyState == ExportState.error || downloadState == ExportState.error
    return <>
        {hasError && <p class="max-w-md text-red-500 text-center">
            Oops! Something broke which means your browser might not be supported 😬
            Please try on Chrome, Firefox, or <a href={urls.github} class="underline">submit an issue on Github</a>. Sorry about that!
        </p>}
    </>
}

export function ExportButtons({ copy, download, notReady, ...styles }: Exports & ButtonStyleProps & { notReady?: boolean }) {
    return <>
        <ExportButton {...copy} {...styles} disabled={notReady || !copy.supported}
            title={copy.supported ? "Copy" : "This browser doesn't support image copy."}>
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path></svg>
        </ExportButton>

        <ExportButton {...download} {...styles} disabled={notReady || !download.supported}
            title={download.supported ? "Download" : "This browser doesn't support image download."}>
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"></path></svg>
        </ExportButton>
    </>
}

type ButtonStyleProps = CssClass & CssStyle
type ButtonProps = Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'>

export function ExportButton({ run, state, disabled, children, class: cls, ...props }: ButtonProps & Children & ExportOptions) {
    const isDisabled = disabled || state == ExportState.loading
    return <button {...props} disabled={isDisabled} onClick={run} class={join(cls, "button")}>
        {state == ExportState.error
            ? <svg class="w-6 h-6 m-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            : state == ExportState.success
                ? <svg class="w-6 h-6 m-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                : state == ExportState.loading
                    ? <svg class="animate-spin w-6 h-6 m-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    : children}
    </button>
}

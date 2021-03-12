import { h, Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { Children, CssClass } from '../misc/types';

type ExportWrapperProps = CssClass & Children & { style: h.JSX.CSSProperties }
const ExportWrapper = forwardRef<HTMLElement, ExportWrapperProps>(ExportWrapper_Raw)

function ExportWrapper_Raw({ style, class: cls, children }: ExportWrapperProps, ref: Ref<HTMLElement>) {
    return <div class="hidden">
        <div ref={ref as any}>
            <section class={cls} style={style}>
                {children}
            </section>
        </div>
    </div>
}

export default ExportWrapper
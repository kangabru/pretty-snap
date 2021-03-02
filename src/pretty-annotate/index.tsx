import { Fragment, h } from 'preact';
import Advanced from '../common/components/advanced';
import NotSupportedWarning from '../common/components/not-supported';
import { ToggleRenderTransparent } from '../common/components/stored-settings';
import Compositor from './components/compositor';
import Controls from './components/controls';
import Shortcuts from './components/shortcuts';

export default function PrettyAnnotate() {
    return <Compositor>
        {exportProps => <>
            <Controls {...exportProps} />
            <NotSupportedWarning />
            <Advanced>
                <div class="col space-y-5">
                    <Shortcuts />
                    <hr class="w-4/5 border-t border-gray-300" />
                    <ToggleRenderTransparent />
                </div>
            </Advanced>
        </>}
    </Compositor>
}
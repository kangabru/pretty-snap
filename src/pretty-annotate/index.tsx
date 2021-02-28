import { Fragment, h } from 'preact';
import Advanced from '../common/components/advanced';
import { SettingRenderTransparent } from '../common/components/stored-settings';
import Compositor from './components/compositor';
import Shortcuts from './components/shortcuts';

export default function PrettyAnnotate() {
    return <>
        <Compositor />
        <Advanced>
            <div class="col space-y-5">
                <SettingRenderTransparent />
                <hr class="w-4/5 border-t border-gray-300" />
                <Shortcuts />
            </div>
        </Advanced>
    </>
}
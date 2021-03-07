import { Fragment, h } from 'preact';
import srcPreview from '../../assets/images/preview-app-annotate.png';
import Advanced from '../common/components/advanced';
import AppInfo from '../common/components/app-info';
import NotSupportedWarning from '../common/components/not-supported';
import { ToggleRenderTransparent } from '../common/components/stored-settings';
import Compositor from './components/compositor';
import Controls from './components/controls';
import Shortcuts from './components/shortcuts';

export default function PrettyAnnotate() {
    return <>
        <Compositor>
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

        <Info />
        <PH />
    </>
}

function Info() {
    return <AppInfo image={srcPreview}>
        <h2 class="text-2xl mb-6 font-semibold">What can I use this for?</h2>
        <p>To communicate quickly and clearly! Use it to:</p>
        <ul class="bullets py-5 space-y-3.5">
            <li>Show-off recent changes you made</li>
            <li>Describe bugs and suggestions</li>
            <li>Make notes about ideas you have</li>
        </ul>
    </AppInfo>
}

function PH() {
    return <a target="_blank"
        href="https://www.producthunt.com/posts/pretty-snap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pretty-snap">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=275698&theme=light" alt="Pretty Snap - Make screenshots look 🔥 with a pretty background | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
    </a>
}

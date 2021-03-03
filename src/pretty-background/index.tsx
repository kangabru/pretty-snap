import { Fragment, h } from 'preact';
import srcPreview from '../../assets/images/preview-app-background.jpg';
import Advanced from '../common/components/advanced';
import AppInfo from '../common/components/app-info';
import NotSupportedWarning from '../common/components/not-supported';
import { ToggleRenderTransparent, ToggleRoundedImageCorners } from '../common/components/stored-settings';
import Compositor from './components/compositor';
import Controls from './components/controls/controls';
import BackgroundControls from './components/controls/controls-bg';

export default function PrettyBackground() {
    return <>
        <Compositor>
            {exportProps => <>
                <Controls {...exportProps} />
                <NotSupportedWarning />
                <BackgroundControls />

                <Advanced>
                    <div class="space-y-3">
                        <ToggleRenderTransparent />
                        <ToggleRoundedImageCorners />
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
        <p>To make boring screenshots awesome! Use them for:</p>
        <ul class="bullets py-5 space-y-3.5">
            <li>Product screenshots on landing pages</li>
            <li>Making a splash on your Github readme</li>
            <li>Eye catching posts on social media</li>
            <li>Standout website <a class="text-gray-900 underline" href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary">summary cards</a></li>
        </ul>
    </AppInfo>
}

function PH() {
    return <a target="_blank"
        href="https://www.producthunt.com/posts/pretty-snap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pretty-snap">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=275698&theme=light" alt="Pretty Snap - Make screenshots look 🔥 with a pretty background | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
    </a>
}

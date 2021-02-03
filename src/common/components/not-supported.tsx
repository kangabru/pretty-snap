import React, { Fragment } from 'react';

export default function NotSupportedWarning() {
    // Seems apple mobile devices run into issues (even on Chrome/Firefox)
    const text = isAppleMobileDevice() ? "Images may not export correctly on iOS mobile devices."
        : !isSupportedBrowser() ? "Images may not export correctly as this browser is not officially supported."
            : undefined
    return !text ? <Fragment /> :
        <p className="row space-x-2 px-4 py-3 mx-4 bg-orange-200 rounded shadow text-lg text-center">
            <svg className="w-6 h-6 mt-1 text-orange-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <span className="flex-1">{text}</span>
        </p>
}

/** Check for Apple mobile devices
 * @see https://stackoverflow.com/a/9039885/3801481
 */
function isAppleMobileDevice() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

/** Checks for Firefox, Chrome, or Edge
 * https://stackoverflow.com/a/9851769/3801481
 */
function isSupportedBrowser() {
    const isFirefox = typeof InstallTrigger !== 'undefined';
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
    return isFirefox || isChrome || isEdgeChromium
}
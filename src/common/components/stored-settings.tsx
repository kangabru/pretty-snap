import { h } from 'preact';
import { useCallback } from 'react';
import useStoredSettings, { SettingRenderTransparent, SettingRoundedImageCorners, StoredSetting } from '../hooks/stored-settings';

function SettingToggle({ setting, text }: { setting: StoredSetting, text: string }) {
    const setStoredSetting = useStoredSettings(s => s.setStoredSetting)
    const setValue = (newVal: boolean) => setStoredSetting(setting, newVal)

    const value = useStoredSettings(useCallback(s => s[setting], [setting]))

    return <div class="row">
        <Toggle id={setting} checked={value} onToggle={setValue} />
        <label class="cursor-pointer" htmlFor={setting}>{text}</label>
    </div>
}

function Toggle({ id, checked, onToggle }: { id: string, checked: boolean, onToggle: (_: boolean) => void }) {
    return <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input id={id} type="checkbox" class="toggle-checkbox" checked={checked} onChange={e => onToggle((e.target as HTMLInputElement)?.checked)} />
        <label htmlFor={id} class="toggle-label" />
    </div>
}

export const ToggleRenderTransparent = () => <SettingToggle setting={SettingRenderTransparent} text="Render transparent corners" />
export const ToggleRoundedImageCorners = () => <SettingToggle setting={SettingRoundedImageCorners} text="Rounded image corners" />
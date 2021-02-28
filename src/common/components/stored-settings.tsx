import { h } from 'preact';
import useStoredSetting, { StoredSetting } from '../hooks/stored-settings';

function SettingToggle({ setting, text }: { setting: StoredSetting, text: string }) {
    const [value, setValue] = useStoredSetting(setting)
    const id = "" + setting
    return <div class="row">
        <Toggle id={id} checked={value} onToggle={setValue} />
        <label class="cursor-pointer" htmlFor={id}>{text}</label>
    </div>
}

function Toggle({ id, checked, onToggle }: { id: string, checked: boolean, onToggle: (_: boolean) => void }) {
    return <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input id={id} type="checkbox" class="toggle-checkbox" checked={checked} onChange={e => onToggle((e.target as HTMLInputElement)?.checked)} />
        <label htmlFor={id} class="toggle-label" />
    </div>
}

export const SettingRenderTransparent = () => <SettingToggle setting={StoredSetting.RenderTransparent} text="Render transparent corners" />
export const SettingRoundedImageCorners = () => <SettingToggle setting={StoredSetting.RoundedImageCorners} text="Rounded image corners" />
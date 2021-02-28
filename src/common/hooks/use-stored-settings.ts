import create from "zustand"
import { devtools } from 'zustand/middleware'

// The stored setting keys
export const SettingRenderTransparent = "render_transparent"
export const SettingRoundedImageCorners = "rounded_image_corners"

// Wrap up the keys into a type
export type StoredSetting = "render_transparent" | "rounded_image_corners"

// Maps all keys to a boolean + extra functions
export type StoredSettingStore = {
    [Property in StoredSetting]: boolean
} & {
    setStoredSetting(_: StoredSetting, value: boolean): void,
}

/** zustand state for state management  */
const useStoredSettings = create<StoredSettingStore>(devtools(set => ({

    [SettingRenderTransparent]: getLocalValue(SettingRenderTransparent, false),
    [SettingRoundedImageCorners]: getLocalValue(SettingRoundedImageCorners, true),

    setStoredSetting(setting: StoredSetting, value: boolean) {
        setLocalValue(setting, value)
        set({ [setting]: value })
    },
}), "Stored Settings"))

/** Gets the locally stored settings. If the local value is null (i.e. not set) then the defaul is returned. */
function getLocalValue(setting: StoredSetting, _default: boolean): boolean {
    const value = localStorage.getItem(setting)
    return value === null ? _default : value === "true"
}

function setLocalValue(setting: StoredSetting, value: boolean) {
    localStorage.setItem(setting, "" + value)
}

export default useStoredSettings
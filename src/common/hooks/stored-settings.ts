import { useEffect, useState } from "preact/hooks"

export enum StoredSetting {
    RenderTransparent = 1,
    RoundedImageCorners = 2
}

const DEFAULTS: { [id: number]: boolean } = {
    [StoredSetting.RenderTransparent]: false,
    [StoredSetting.RoundedImageCorners]: true,
}

export default function useStoredSetting(setting: StoredSetting): [boolean, (_: boolean) => void] {
    const [value, setValue] = useState(DEFAULTS[setting] ?? false)
    useEffect(() => void setValue(getStoredSetting(setting)), [setting]) // Initial load
    useEffect(() => void setStoredSetting(setting, value), [setting, value]) // On change
    return [value, setValue]
}

function getStoredSetting(setting: StoredSetting): boolean {
    return localStorage.getItem("" + setting) === "true"
}

function setStoredSetting(setting: StoredSetting, value: boolean) {
    localStorage.setItem("" + setting, "" + value)
}
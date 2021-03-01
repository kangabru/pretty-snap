import { useState } from "preact/hooks"

export type ClassProp = string | boolean | undefined | null
export const join = (...classes: ClassProp[]): string => joinRaw(classes, " ")
export const joinRaw = (classes: ClassProp[], separator: string): string => classes.filter(x => !!x).join(separator)

export const getRandomItem = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]
export const useRandomItem = <T>(items: T[]) => useState(getRandomItem(items))[0]

export const srcToUrl = (src: string) => `url('${src}')`
export const srcToUrlSvg = (src: string) => srcToUrl("data:image/svg+xml," + src)

export function delay(timeout: number) {
    return new Promise(accept => setTimeout(accept, timeout))
}

export function onKey(key: string, callback: (e: KeyboardEvent) => void) {
    return onKeys({ [key]: callback })
}

export function onKeys(callbackMap: { [key: string]: (e: KeyboardEvent) => void }) {
    return (e: KeyboardEvent) => void callbackMap[e.key]?.(e)
}

export function textClass(useDarkText: boolean | undefined) {
    return useDarkText ? "text-gray-800" : "text-white"
}

export function remToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function getRenderScale(screenContWidth: number, renderContWidth: number | undefined) {
    return screenContWidth > 1 ? (renderContWidth ?? 0) / screenContWidth : 1
}
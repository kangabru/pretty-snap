import { useState } from "preact/hooks"

export type ClassProp = string | boolean | undefined | null
export const join = (...classes: ClassProp[]): string => joinRaw(classes, " ")
export const joinRaw = (classes: ClassProp[], separator: string): string => classes.filter(x => !!x).join(separator)

export const getRandomItem = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]
export const useRandomItem = <T>(items: T[]) => useState(getRandomItem(items))[0]

export const srcToUrl = (src: string) => `url('${src}')`
export const srcToUrlSvg = (src: string) => srcToUrl("data:image/svg+xml," + src)

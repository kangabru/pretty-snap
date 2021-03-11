import { h } from "preact"

export type Children = JSX.ElementChildrenAttribute
export type ChildrenWithProps<T> = { children: (_: T) => JSX.Element }

export type CssClass = { class?: string }
export type CssStyle = { style?: string | h.JSX.CSSProperties }

export type ForegroundImage = { src: string, width: number, height: number }

export type MouseFunc = (e: MouseEvent) => void

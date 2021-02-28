import { h } from "preact"

export type Children = JSX.ElementChildrenAttribute
export type CssStyle = { style?: string | h.JSX.CSSProperties }
export type CssClass = { class?: string }
export type ForegroundImage = { src: string, width: number, height: number }
import { h } from "preact"

export type Children = JSX.ElementChildrenAttribute
export type CSSProps = { style?: string | h.JSX.CSSProperties }
export type CSSClass = { class?: string }
export type ForegroundImage = { src: string, width: number, height: number }
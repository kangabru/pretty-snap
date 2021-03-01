export const KEYS = {
    Enter: "Enter",
    Escape: "Escape",
}

export const IsEnter = (e: KeyboardEvent) => e.key == KEYS.Enter
export const IsEscape = (e: KeyboardEvent) => e.key == KEYS.Escape

export const IsUp = (e: KeyboardEvent) => e.key == "ArrowUp" || e.key == "Up"
export const IsDown = (e: KeyboardEvent) => e.key == "ArrowDown" || e.key == "Down"
export const IsLeft = (e: KeyboardEvent) => e.key == "ArrowLeft" || e.key == "Left"
export const IsRight = (e: KeyboardEvent) => e.key == "ArrowRight" || e.key == "Right"

export const IsAlt = (e: KeyboardEvent) => e.key == 'Alt'

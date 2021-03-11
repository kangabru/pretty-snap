export const KEYS = {
    Enter: "Enter",
    Escape: "Escape",
    Delete: "Delete",
}

export const IsKey = (e: KeyboardEvent, ...keys: string[]) => keys.find(key => e.key.toLowerCase() === key.toLowerCase())
export const IsKeyCallback = (...keys: string[]) => (e: KeyboardEvent) => IsKey(e, ...keys)

export const IsEnter = IsKeyCallback(KEYS.Enter)
export const IsEscape = IsKeyCallback(KEYS.Escape)
export const IsDelete = IsKeyCallback(KEYS.Delete)

export const IsUp = IsKeyCallback("ArrowUp", "Up")
export const IsDown = IsKeyCallback("ArrowDown", "Down")
export const IsLeft = IsKeyCallback("ArrowLeft", "Left")
export const IsRight = IsKeyCallback("ArrowRight", "Right")

export const IsAlt = IsKeyCallback('Alt')

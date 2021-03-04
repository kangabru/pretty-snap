import { h } from "preact";
import { CssClass } from "../../../common/misc/types";
import { join } from "../../../common/misc/utils";

export type Command = { command?: string }

export default function CommandText({ command, class: cls }: Command & CssClass) {
    return command ? <span class={join(cls ?? "text-gray-400", "hidden sm:block absolute bottom-px right-px text-sm leading-none transform scale-75")}>
        {command}
    </span> : null
}
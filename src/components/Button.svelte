<script lang="ts">
    import pSBC from "shade-blend-color";
    import {createEventDispatcher} from "svelte";
    import {isColorDark} from "../util/isColorDark";

    export let primaryColor: string;
    export let secondaryColor: string;
    export let text: string = "Button";
    export let variant: "contained" | "outlined" = "contained";


    $: hoverColor = (() => {
        const pr = primaryColor || "#000000";
        const sec = secondaryColor || "#FFFFFF";

        if (variant == "contained") {
            const isDark = isColorDark(pr);
            return pSBC(
              isDark ? -0.1 : 0.1,
              pr
            )
        } else if (variant == "outlined") {
            const isDark = isColorDark(sec);
            return pSBC(
              isDark ? -0.1 : 0.1,
              sec
            )
        }
    })();

</script>

<button on:click={(e) => {}}
        style:=""
>{text}</button>
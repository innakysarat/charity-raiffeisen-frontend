<script lang="ts">

    import {onMount} from "svelte";
    import {getMyWidgets} from "../api/getMyWidgets";
    import {BASE_URL} from "../constants";
    import {getWidgetById} from "../api/getWidgetById";

    // let widgetsIds: string[] = [];

    let widgets: Array<{
        widgetId: string,
        widthPx: number,
        heightPx: number
    }> = [];

    onMount(() => {
        getMyWidgets()
            .then(widgetsIds => {
                console.log(widgetsIds);

                return Promise.all(
                    widgetsIds
                        .map(
                            widgetId =>
                                getWidgetById(widgetId)
                                    .then(({templateId}) => ({
                                        widgetId,
                                        widthPx: templateId === "first" ? 720 : 500,
                                        heightPx: templateId === "first" ? 360 : 250,
                                    }))
                        )
                );
            })
            .then(ws => {
                ws.sort();
                widgets = ws.filter((widget, i) => widget.widgetId % 2 === 0);
            })
    });

    const widgetToIframeCode = (widget) => {
        return `<iframe style="border: none; align-self: flex-start"
              src="${BASE_URL}/widget.html?widgetId=${widget.widgetId}"
              width="${widget.widthPx}"
              height="${widget.heightPx}"></iframe>`;
    }

    function copyToClipboard() {
        var textToCopy = document.getElementById("widget-code").value;
        navigator.clipboard.writeText(textToCopy)
            .then(function () {
                console.log("Text copied to clipboard: " + textToCopy);
            })
            .catch(function (error) {
                console.error("Failed to copy text: " + error);
            });
    }

</script>

<div class="widget-list">
    {#each widgets as widget}
        {@const code = widgetToIframeCode(widget)}
        <div class="widget-instance">
            {@html code}
            <code class="widget-code">{code}</code>
        </div>
    {/each}
</div>

<style>
    .widget-list {
        display: flex;
        gap: 100px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .widget-instance {
        display: flex;
        gap: 30px;
        justify-content: flex-start;
        align-items: center;
    }

    .widget-code {
        background-color: #DDDDDD;
        border-radius: 1rem;
        max-width: 400px;
    }
</style>

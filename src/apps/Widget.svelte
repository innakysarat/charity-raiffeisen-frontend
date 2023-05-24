<script>
    import {getWidgetById} from "../api/getWidgetById";
    import Template1 from "../widgets/Template1.svelte";
    import Template2 from "../widgets/Template2.svelte";
    import "../css/normalize.css";
    import "../css/svelte-mui.css";

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const widgetId = params["widgetId"];

    const templateIdToComponentMap = {
        "first": Template1,
        "second": Template2
    }

    let show = false;
    let sbpMerchantId;
    let templateId;
    let templateProps;

    let template;
    $: template = templateIdToComponentMap[templateId];

    if (widgetId) getWidgetById(widgetId)
      .then(data => {
          sbpMerchantId = data.sbpMerchantId;
          templateId = data.templateId;
          templateProps = JSON.parse(data.templateProps);
          show = true;
      })
      .catch()
</script>

{#if show}
    <svelte:component this={template} {...templateProps} sbpMerchantId={sbpMerchantId}/>
{/if}
<script lang="ts">
    import screenFirst from "../assets/screen-first.png";
    import screenSecond from "../assets/screen-second.png";
    import TextField from "@smui/textfield";
    import Button from "@smui/button";
    import {createWidget} from "../api/createWidget";
    import {BASE_URL} from "../constants";

    let selected: "first" | "second" = "first";

    const onClickVariant = (variant: "first" | "second") => () => {
        if (selected === variant) return;
        selected = variant;
    }

    let title: string = "Название";
    let mainColor: string = "#FDDB00";
    let snackbarText: string = "Подписка прошла успешно!";

    const onClickCreate = () => {
        const templateId = selected;
        const templateProps = JSON.stringify(selected === "first" ?
            {title, mainColor}:
            {title, snackbarText}
        );

        createWidget(templateId, templateProps)
            .then(widgetId => {
                code = `<iframe style="border: none; align-self: flex-start"
              src="${BASE_URL}/widget.html?widgetId=${widgetId}"
              width="${templateId === "first" ? 720 : 500}"
              height="${templateId === "first" ? 360 : 250}"></iframe>`;
            })
    }

    let code: string = "";

    // $: {
    //     console.log("selected changed to ", $selected);
    //     title = "Название";
    //     mainColor = "#FDDB00";
    //     snackbarText = "Подписка прошла успешно!";
    // }

</script>

<div class="create-widget">
    <h1 class="select-template-title">Шаблон виджета</h1>
    <div class="screens-container">
        <img src="{screenFirst}" class="screen"
             class:screen_not-selected={selected !== "first"}
             class:screen_selected={selected === "first"}
             on:click={onClickVariant("first")}
             width="{720}" height="{360}">
        <img src="{screenSecond}" class="screen"
             class:screen_not-selected={selected !== "second"}
             class:screen_selected={selected === "second"}
             on:click={onClickVariant("second")}
             width="{500}" height="{250}">
    </div>
    <h1 class="select-template-title">Параметры виджета</h1>
    <div class="widget-parameters">
        <h3 class="parameter-name">Заголовок</h3>
        <TextField bind:value={title}/>

        {#if selected === "first"}
            <h3 class="parameter-name">Основной цвет</h3>
            <input type="color" bind:value={mainColor}/>
        {:else }
            <h3 class="parameter-name">Уведомление при оплате</h3>
            <TextField bind:value={snackbarText}/>
        {/if}
    </div>

    <Button on:click={onClickCreate}>Создать</Button>
    <br/>
    {#if code}
        <h1 class="select-template-title">Код для вставки виджета</h1>
        <code>{code}</code>
    {/if}


</div>

<style>
    .create-widget {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 3rem;
    }

    .select-template-title {
        font-size: 25px;
    }

    .screens-container {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 2rem;
    }

    .screen {
        transition: opacity .3s ease-out;
        cursor: pointer;
    }

    .screen_selected {
        opacity: 1;
        outline: #FDDB00 solid 4px;
    }

    .screen_not-selected {
        opacity: .4;
        outline: none;
    }

    .screen_not-selected:hover, .screen_not-selected:focus  {
        outline: grey solid 4px;
    }

    .widget-parameters {
        display: flex;
        gap: 1rem;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .parameter-name {
        font-size: 20px;
    }
</style>
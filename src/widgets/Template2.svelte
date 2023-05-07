<script lang="ts">
    import {writable} from "svelte/store";
    import qrStore from "../store/qrStore";
    import Snackbar, { Label } from '@smui/snackbar';
    import TextField from "@smui/textfield";
    import Checkbox from '@smui/checkbox';
    import sbpIcon from "../assets/sbp.svg";

    export let sbpMerchantId: string;
    export let title: string;
    export let snackbarText: string;

    const amount = writable<number>(500);
    const isSubscription = writable<boolean>(false);

    const qr = qrStore(sbpMerchantId, amount, isSubscription);

    let snackbar: Snackbar;

    $: {
        const isPaid = $qr.isPaid;

        if (isPaid) {
            // @ts-ignore
            snackbar.open()

            setTimeout(() => {
                // @ts-ignore
                snackbar.close()
            }, 5000)
        }

    }

    $: console.log($qr);

</script>

<Snackbar bind:this={snackbar}>
    <Label>{snackbarText}</Label>
</Snackbar>

<div class="widget"
     style:--mdc-theme-primary="#FDDB00"
     style:--mdc-checkbox-checked-color="#FDDB00"
>
    <div class="left-panel">
        <h3 class="panel__title">{title}</h3>
        <div class="line">
            <TextField class="input-amount" style="width: 30%" bind:value={$amount} suffix="₽"/>
            <Checkbox style="margin-left: 10px;" bind:checked={$isSubscription}/>
            Подписаться
        </div>
        <img style="margin-top: 1rem;" width="{90}" height="{46}" src="{sbpIcon}" alt="Иконка СБП – Система быстрых платежей"/>
    </div>
    <div class="right-panel">
        {#if (!$qr.loading)}
            <img src="{$qr.url}" style="width: 100%; height: 100%;" />
        {/if}
    </div>
</div>

<style>
    .widget {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        height: 100%;
        padding: 1rem 1rem 1rem 1rem;
        box-sizing: border-box;
        border-radius: 1rem;
        border: 2px solid black;
    }

    .panel__title {
        font-size: 22px;
        color: black;
        align-self: flex-start;
    }

    .left-panel {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .line {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

    }

    .right-panel {
        width: 50%;
        display: block;
        height: 100%;
    }

    * :global(.input-amount), * :global(.input-amount > *) {
        font-size: 1.5rem;
        text-align: center;
    }


</style>
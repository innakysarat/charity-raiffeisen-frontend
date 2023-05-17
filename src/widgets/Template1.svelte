<script lang="ts">
    import {writable} from "svelte/store";
    import qrStore from "../store/qrStore";
    import sbpIcon from "../assets/sbp.svg";
    import Snackbar, {Label} from '@smui/snackbar';
    import Button from "@smui/button";
    import TextField from "@smui/textfield"
    import HelperText from '@smui/textfield/helper-text';
    import Fab from '@smui/fab';

    export let sbpMerchantId: string;
    export let title: string;
    export let mainColor: string;

    const amount = writable<number>(500);
    const isSubscription = writable<boolean>(false);

    amount.subscribe((newAmount) => {
        console.log(newAmount)
    })
    const qr = qrStore(sbpMerchantId, amount, isSubscription);

    let snackbar: Snackbar;
    let snackbar_email: Snackbar;

    let step: "qr" | "paid" = "qr"

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

        step = isPaid ? "paid" : "qr"
    }

    $: console.log($qr);

    let email = '';

    async function sendEmail() {
        // Handle sending the email
        const url = "http://localhost:8080/email/send";
        const qrId = "AD9EEDFF824C421AADA9099789FD6021";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json"
            },
            body: JSON.stringify({qrId, email})
        });

        if (response.status === 200) {
            // @ts-ignore
            snackbar_email.open()

            setTimeout(() => {
                // @ts-ignore
                snackbar_email.close()
            }, 4000)
            step = "qr";
        }

    }

    async function skip() {
        // Handle skipping the email
        const qrId = "AD9EEDFF824C421AADA9099789FD6021";
        const url = "http://localhost:8080/email/sendDefault/" + qrId;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json"
            }
        });
        if (response.status === 200) {
            step = "qr";
        }

    }

</script>

<Snackbar bind:this={snackbar}>
    <Label>Оплата прошла успешно!</Label>
</Snackbar>

<Snackbar bind:this={snackbar_email}>
    <Label>Чек отправлен на почту!</Label>
</Snackbar>

<div class="widget">
    {#if (step === "qr")}
        <div class="left-panel" style:--mdc-theme-primary="{mainColor}">
            <h3 class="panel__title">{title}</h3>
            <span class="panel__text"
                  style:align-self="flex-start"
                  style:margin-top=".5rem"
            >Благотворительное пожертвование</span>
            <div class="panel__sum-controller">
                <TextField suffix="₽" class="sum-controller__input" bind:value={$amount}/>
                <div class="sum-controller__buttons">
                    {#each [100, 200, 500, 1000, 5000] as sum}
                        <Button color="{mainColor}" class="sum-button" on:click={() => amount.set(sum)}
                                variant="{$amount === sum ? 'unelevated' : 'outlined'}"
                        >{sum}</Button>
                    {/each}
                </div>
            </div>

            <span class="panel__text" style="margin-top: 10px">пожертвовать</span>
            <div class="strategy-buttons">
                <Button color="{mainColor}" class="strategy-button"
                        on:click={() => isSubscription.set(false)}
                        variant="{$isSubscription ? 'outlined' : 'unelevated'}"
                >один раз
                </Button>
                <Button color="{mainColor}" class="strategy-button"
                        on:click={() => isSubscription.set(true)}
                        variant="{$isSubscription ? 'unelevated': 'outlined'}"
                >ежемесячно
                </Button>
            </div>

            <div class="bottom-icons">
                <img width="{135}" height="{69}" src="{sbpIcon}" alt="Иконка СБП – Система быстрых платежей"/>
            </div>
        </div>
        <div class="right-panel">
            {#if (!$qr.loading)}
                <img src="{$qr.url}" style="width: 100%; height: 100%;"/>
            {/if}
        </div>
    {:else}
        <div class="fiscal-panel" style:--mdc-theme-primary="{mainColor}">
            <h3 class="fiscal_title">{"Отправить электронный чек?"}</h3>
            <TextField variant="filled" bind:value={email} label="Filled">
                <HelperText persistent slot="helper">Формат почты:</HelperText>
            </TextField>
            <div class="fiscal-buttons">
                <Fab
                        on:click={sendEmail} extended>
                    <Label>Send</Label>
                </Fab>
                <Fab
                        on:click={skip} extended>
                    <Label>Skip</Label>
                </Fab>
            </div>
            <div class="right-icons">
                <img width="{120}" height="{60}" src="{sbpIcon}" alt="Иконка СБП – Система быстрых платежей"/>
            </div>
        </div>
    {/if}

</div>

<style>
    .fiscal-panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .fiscal-buttons {
        margin-top: 5px;
        display: flex;
        justify-content: center;
        gap: 5px;
    }

    .fiscal_title {
        font-size: 20px;
        color: black;
        align-self: center;
    }

    .widget {
        display: flex;
        align-items: center;
        gap: 2rem;
        width: 100%;
        height: 100%;
        padding: 1rem 1rem 1rem 2rem;
        box-sizing: border-box;
        border-radius: 1rem;
        border: 2px solid black;
    }

    .left-panel {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .right-panel {
        width: 50%;
        display: block;
        height: 100%;
    }

    .panel__title {
        font-size: 30px;
        color: black;
        align-self: flex-start;
    }

    .panel__text {
        font-size: 14px;
        color: #939393;
    }

    .panel__sum-controller {
        display: flex;
        flex-direction: column;
    }

    * :global(.sum-controller__input), * :global(.sum-controller__input > *) {
        font-size: 2rem;
        text-align: center;
    }

    .sum-controller__buttons {
        display: flex;
        justify-content: center;
        width: 100%;
        gap: 3px;
    }

    * :global(.sum-button) {
        margin-top: 8px;
        font-size: 1rem;
        border-radius: 8px;
        height: 2em;
    }

    * :global(.strategy-button) {
        min-width: 114px;
        text-align: center;
        font-size: 1rem;
        text-transform: none;
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 8px;
    }

    .strategy-buttons {
        margin-top: 5px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    :global(input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button) {
        -webkit-appearance: none;
        margin: 0;
    }

    :global(input[type=number]) {
        -moz-appearance: textfield;
    }

    :global(#app) {
        --mdc-theme-primary: #64458E;
    }

    .bottom-icons {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
    }

    .right-icons {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12rem;
    }

</style>

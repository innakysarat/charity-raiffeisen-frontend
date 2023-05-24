<script lang="ts">
    import TextField from "@smui/textfield";
    import Button from "@smui/button";
    import {login as loginRequest} from "../api/login";
    import {login} from "../store/auth";
    import Snackbar, {Actions, Label} from "@smui/snackbar";
    import IconButton from '@smui/icon-button';


    let loginValue: string = "";
    let passwordValue: string = "";
    let error: any = null;
    let snackbarWarning: Snackbar;

    // $: console.log(loginValue)

    const onClickLogin = () => {
        loginRequest(loginValue, passwordValue)
          .then(jwt => login(jwt))
          .then(() => {
              error = null;
          })
          .catch((e) => {
              // @ts-ignore
              snackbarWarning.open();
              setTimeout(() => {
                  // @ts-ignore
                  snackbarWarning.close()
              }, 4000)
              error = e;
          });
    }
    // $: console.log(loginValue, passwordValue);
</script>

<div class="auth">
    <TextField bind:value={loginValue} variant="outlined" required label="Логин"/>
    <TextField bind:value={passwordValue} variant="outlined" required label="Пароль" type="password"/>
    {#if error}
        <div style="color: red">
            Неверный логин или пароль
        </div>
    {/if}
    <Button on:click={onClickLogin} variant="unelevated">Войти</Button>
    <Snackbar bind:this={snackbarWarning} class="demo-warning">
        <Label>Ok, it looks like that your login or password is incorrect.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
</div>

<style>
    .auth {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: fit-content;
        justify-content: center;
        align-items: flex-start;
    }
</style>
<script lang="ts">
    import {login as loginRequest} from "../api/login";
    import {login} from "../store/auth";
    import Snackbar, {Actions, Label} from "@smui/snackbar";
    import IconButton from '@smui/icon-button';
    import {useForm} from "svelte-use-form";
    import TextField from "@smui/textfield";

    const form = useForm();


    let loginValue: string = "";
    let passwordValue: string = "";
    let error: any = null;
    let snackbarWarning: Snackbar;


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
    <div class="form">
        <div class="logo">
            <div aria-orientation="horizontal" type="default">
                <svg width='187' height='44' viewBox='0 0 187 44' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <g clipPath='url(#clip0)'>
                        <path d='M45.7179 0H0V43.9992H45.7179V0Z' fill='black' />
                        <path d='M44.5023 1.30066H1.35156V42.8307H44.5023V1.30066Z' fill='#FFEE00' />
                        <path
                                d='M3.65007 34.3684L9.33175 39.8359L22.4507 26.947L36.1132 40.0952L41.7949 34.6278L28.2683 21.611L30.8392 19.1384V13.9303L32.4625 12.63V16.9251L34.4899 18.6161L40.7114 12.6264L42.7388 14.0581C43.9544 9.89092 37.0571 0.259771 31.3754 5.59582L24.7462 11.9763L26.0977 13.5394L22.7151 16.6622L19.6043 13.5394L21.3636 12.1077L14.0586 5.34C8.64862 1.0449 2.96695 7.55329 2.83105 14.0617L4.85839 12.4985L10.9441 18.8755L13.1073 17.1845V13.2801L14.4589 14.321V19.3977L17.1657 22.0018L3.63905 34.3684H3.65007Z'
                                fill='black'
                        />
                        <path
                                d='M57.6833 11.0063V32.965H63.5706V24.5382L69.2195 32.965H76.5355L69.4214 23.9769C70.4756 23.7779 71.669 23.2841 72.5507 22.4635C73.6745 21.4119 74.3539 19.7635 74.3539 17.8877C74.3539 16.1434 73.7075 14.2321 72.4148 12.9496C70.7471 11.2692 68.5695 11.0063 66.8689 11.0063H57.6797H57.6833ZM63.5706 15.4186H64.6949C65.9876 15.4186 66.9755 15.749 67.5189 16.2748C68.0293 16.7367 68.3012 17.4614 68.3012 18.1187C68.3012 18.8078 67.9963 19.5326 67.5518 19.9624C66.8395 20.6197 65.5798 20.8506 64.6949 20.8506H63.5706V15.4186ZM88.9272 19.664C88.2808 18.9712 86.8156 17.7563 84.3656 17.7563C82.188 17.7563 80.1789 18.5805 78.8861 19.831C77.6593 21.014 76.5391 22.9573 76.5391 25.7248C76.5391 27.931 77.2519 29.6078 78.7172 31.1247C80.5533 33.0006 82.5624 33.4624 84.1967 33.4624C85.6954 33.4624 87.6674 33.0325 88.9272 31.3557V32.9686H94.3737V18.2537H88.9272V19.6712V19.664ZM85.5924 22.2326C86.7492 22.2326 87.5315 22.7264 88.0424 23.1882C88.8942 23.9769 89.0961 24.9006 89.0961 25.5933C89.0961 26.7799 88.5528 27.5047 88.0753 27.963C87.3955 28.6202 86.5107 28.9825 85.6254 28.9825C84.7075 28.9825 83.7522 28.5207 83.1758 27.9949C82.4965 27.3697 82.1216 26.4495 82.1216 25.5933C82.1216 24.8366 82.4631 23.881 83.2088 23.1882C83.9911 22.4635 84.9094 22.2326 85.5924 22.2326ZM98.1164 18.2501V32.965H103.559V18.2501H98.1164ZM97.7749 12.1289C97.7749 13.7738 99.1372 15.0918 100.838 15.0918C102.538 15.0918 103.901 13.7738 103.901 12.1289C103.901 10.4841 102.538 9.16607 100.838 9.16607C99.1372 9.16607 97.7749 10.4841 97.7749 12.1289ZM116.935 22.563V18.2501H113.123V16.1754C113.123 15.4506 113.156 14.3315 113.736 13.7063C113.975 13.4434 114.453 13.145 115.268 13.145C115.573 13.145 116.223 13.2125 116.969 13.6388V9.09501C116.186 8.80012 115.371 8.6012 114.346 8.6012C112.543 8.6012 110.468 9.12695 109.072 10.9388C107.845 12.5197 107.676 14.2001 107.676 15.7775V18.2465H105.77V22.5594H107.676V32.9615H113.119V22.5594H116.932L116.935 22.563Z'
                                fill='black'
                        />
                        <path

                                d='M137.348 25.6895C139.118 25.6895 141.226 25.4585 142.996 23.7817C144.767 22.1013 145.006 20.0621 145.006 18.3177C145.006 16.474 144.664 14.6302 142.897 12.9853C141.16 11.3724 139.118 11.01 137.146 11.01H127.751V32.9687H133.638V25.693H137.348V25.6895ZM133.638 15.6142H135.647C136.397 15.6142 137.484 15.7137 138.167 16.4064C138.78 16.9997 138.846 17.7884 138.846 18.3817C138.846 18.9075 138.813 19.7957 138.097 20.3889C137.381 21.0142 136.224 21.0817 135.614 21.0817H133.638V15.6178V15.6142ZM158.991 19.6642C158.345 18.9715 156.883 17.7529 154.43 17.7529C152.252 17.7529 150.243 18.5771 148.95 19.8276C147.723 21.0142 146.603 22.9539 146.603 25.7214C146.603 27.9276 147.319 29.6044 148.781 31.1214C150.617 32.9972 152.626 33.459 154.261 33.459C155.759 33.459 157.731 33.0292 158.991 31.3523V32.9652H164.438V18.2503H158.991V19.6678V19.6642ZM155.656 22.2327C156.813 22.2327 157.596 22.7266 158.106 23.1884C158.958 23.9771 159.16 24.9008 159.16 25.59C159.16 26.7765 158.616 27.4977 158.139 27.9596C157.46 28.6168 156.574 28.9792 155.689 28.9792C154.771 28.9792 153.816 28.5173 153.239 27.9915C152.56 27.3663 152.186 26.4461 152.186 25.59C152.186 24.8333 152.527 23.8776 153.273 23.1884C154.055 22.4637 154.973 22.2327 155.656 22.2327ZM168.691 40.5039H174.784L187.003 18.2503H180.774L176.826 25.7889L172.775 18.2503H166.443L173.792 30.958L168.687 40.5039H168.691Z'
                                fill='black'
                        />
                    </g>
                    <defs>
                        <clipPath id='clip0'>
                            <rect width='187' height='44' fill='white' />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
        <div class="form-group">
            <label>Имя пользователя:</label>
            <TextField bind:value={loginValue} variant="outlined" required label="Логин"/>
        </div>
        <div class="form-group">
            <label>Пароль:</label>
            <TextField bind:value={passwordValue} variant="outlined" required label="Пароль" type="password"/>
        </div>
        {#if error}
            <div style="color: red">
                Неверный логин или пароль
            </div>
        {/if}
        <button class="submit-button" on:click={onClickLogin} variant="unelevated">Войти</button>

        <Snackbar bind:this={snackbarWarning} class="demo-warning">
            <Label>Ok, it looks like that your login or password is incorrect.</Label>
            <Actions>
                <IconButton class="material-icons" title="Dismiss">close</IconButton>
            </Actions>
        </Snackbar>
    </div>
</div>

<style>

    .auth {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        max-width: 400px;
        margin: 0 auto;
        border: 1px solid #ccc;
        box-sizing: border-box;
        width: 100%;
        font-family: "ALS Hauss", Helvetica, "Helvetica New", Arial, sans-serif;
        background-color: rgb(255, 255, 255);
        padding: 32px;
        border-radius: 24px;
        box-shadow: rgba(0, 0, 0, 0.08) 0 8px 32px 0;
    }

    .form {
        justify-content: center;
        align-items: center;
        padding: 10px 10px;
    }

    .form-group {
        margin-bottom: 10px;
        padding: 10px 10px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .submit-button {
        display: inline-flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        box-sizing: border-box;
        white-space: nowrap;
        user-select: none;
        appearance: none;
        cursor: pointer;
        outline: 0;
        position: relative;
        border-radius: 8px;
        border-color: transparent;
        font-family: "ALS Hauss", Helvetica, "Helvetica New", Arial, sans-serif;
        font-weight: 500;
        text-decoration: none;
        transition: background-color 0.3s ease 0s, color 0.3s ease 0s, border-color 0.3s ease 0s;
        font-size: 16px;
        line-height: 26px;
        padding: 0 24px;
        height: 48px;
        color: rgb(43, 45, 51);
        background-color: rgb(254, 230, 0);
        width: 100%;
    }

    .logo {
        margin-bottom: 10px;
    }

    .submit-button:hover {
        background-color: rgba(240, 220, 0, 1);
    }
</style>
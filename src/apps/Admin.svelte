<script lang="ts">

    import {login, logout, useIsAuth} from "../store/auth.js";
    import {login as loginRequest} from "../api/login";
    import Auth from "../components/Auth.svelte";
    import Drawer, {
        AppContent,
        Content,
        Header,
        Title,
        Subtitle,
    } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';
    import "../css/normalize.css";
    import "../css/svelte-mui.css";
    import CreateWidget from "../components/CreateWidget.svelte";
    import MyWidgets from "../components/MyWidgets.svelte";
    import Statistics from "../components/Statistics.svelte";

    const onClickLogout = () => {
        logout();
    }

    let active = 'my-widgets';
    let open = false;

    function setActive(value: string) {
        active = value;
    }

    $: console.log(active)

    let flag: boolean = false;

    console.log("admin here")
</script>

{#if $useIsAuth}
    <div class="drawer-container">
        <Drawer open="{true}" variant="dismissible">
            <Header>
                <Title>Панель администратора</Title>
                <Subtitle>Настройки виджетов и статистика</Subtitle>
            </Header>
            <Content>
                <List>
                    <Item
                      on:click={() => setActive('my-widgets')}
                      activated={active === 'my-widgets'}
                    >
                        <Text>Мои виджеты</Text>
                    </Item>
                    <Item
                      on:click={() => setActive('create-widget')}
                      activated={active === 'create-widget'}
                    >
                        <Text>Создать виджет</Text>
                    </Item>
                    <Item
                      on:click={() => setActive('statistics')}
                      activated={active === 'statistics'}
                    >
                        <Text>Статистика</Text>
                    </Item>
                    <Item
                      on:click={logout}
                    >
                        <Text>Выйти</Text>
                    </Item>
                </List>
            </Content>
        </Drawer>

        <AppContent class="app-content">
            <main class="main-content">
                {#if active === "create-widget"}
                    <CreateWidget/>
                {:else if active === "my-widgets"}
                    <MyWidgets/>
                {:else if active === "statistics"}
                    <Statistics/>
                {/if}
            </main>
        </AppContent>
    </div>
{:else}
    <div class="auth-container">
        <Auth/>
    </div>
{/if}

<style>
    .auth-container {
        display: flex;
        justify-content: center;
        padding-top: 10rem;
    }

    .drawer-container {
        position: relative;
        display: flex;
        height: 100%;
        width: 100%;
        overflow: hidden;
        z-index: 0;
    }

    * :global(.app-content) {
        flex: auto;
        overflow: auto;
        position: relative;
        flex-grow: 1;
    }

    .main-content {
        overflow: auto;
        padding: 16px;
        height: 100%;
        box-sizing: border-box;
    }
</style>

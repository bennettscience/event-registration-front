<script>
    // TODO: Rename all instances of 'Course' to 'Event' for more generic naming.

    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import Toast from './components/Toast.svelte';
    import page from 'page';
    import * as Sentry from '@sentry/browser';
    import { Integrations } from '@sentry/tracing';

    // Sentry.init({
    //     dsn: 'https://c7bbacad63af4dad981e79264ae5c80f@o288929.ingest.sentry.io/5960721',
    //     integrations: [new Integrations.BrowserTracing()],
    //     tracesSampleRate: 0.5,
    // });

    import { user } from './store';

    import Navigation from './components/nav/Navigation.svelte';
    import Login from './components/Login.svelte';

    // Routing
    import Home from './pages/home.svelte';
    import Create from './pages/create.svelte';
    import Schedule from './pages/schedule.svelte';
    import Admin from './pages/admin.svelte';
    import Presenter from './pages/presenter.svelte';
    import Documents from './pages/documents.svelte';
    import Users from './pages/users.svelte';

    // set default component
    let current = Login;

    // set Toast data
    let showToast = false;
    let isError = false;
    let toastBody = '';

    // Map routes to page. If a route is hit the current
    // reference is set to the route's component
    // TODO: Declarative routing
    // https://codechips.me/svelte-routing-with-page-js-part-1
    page('/', () => (current = Home));
    page('/create', () => (current = Create));
    page('/schedule', () => (current = Schedule));
    page('/admin', () => (current = Admin));
    page('/presenter', () => (current = Presenter));
    page('/documents', () => (current = Documents));
    page('/people', () => (current = Users));

    // activate router
    page.start();

    let isAuthenticated = false;

    // Check the window width and load the approprate navigation items
    let width;
    let showMobileMenu = false;

    // TODO: Implement Observer role views, permissions.

    const getSession = async () => {
        try {
            let req = await fetch('/getsession', {
                credentials: 'same-origin',
            });

            let data = await req.json();

            if (data.login === true) {
                $user = data.user;
                isAuthenticated = true;
                current = Home;
            }
        } catch (err) {
            handleToast(err);
        }
        isAuthenticated = isAuthenticated;
    };

    const handleToast = (data) => {
        showToast = true;
        isError = data.detail.isError;
        toastBody = data.detail.toastBody;

        setTimeout(() => (showToast = false), 5000);
    };
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/jodit/3.4.25/jodit.min.css"
    />
</svelte:head>

<svelte:window bind:innerWidth={width} />
<main>
    {#await getSession() then session}
        <Navigation bind:isAuthenticated on:handleToast />
        {#if isAuthenticated}
            <svelte:component this={current} on:handleToast={handleToast} />
        {:else}
            <Login bind:isAuthenticated on:handleToast />
        {/if}
    {/await}
    {#if showToast}
        <Toast {isError} {toastBody} />
    {/if}
</main>

<style>
    @font-face {
        font-family: 'Oswald';
        src: url('/fonts/Oswald-VariableFont_wght.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Roboto Light';
        src: url('/fonts/Roboto-Light.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/Roboto-Regular.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Roboto Bold';
        src: url('/fonts/Roboto-Bold.ttf') format('truetype');
    }
    @font-face {
        font-family: 'Roboto Italic';
        src: url('/fonts/Roboto-Italic.ttf') format('truetype');
    }

    :root {
        /* Colors */
        --site-gray: #c5c6c7;
        --accent-blue: #0098fa;
        --accent-red: #e9164f;
        --accent-green: #32c192;
        --site-dark: #1f2833;
        --text-white: #f0ecec;

        /* shadow */
        --box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
            rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
        --active-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
            rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
        --left-shadow: rgba(0, 0, 0, 0.1) -20px 0 25px -5px,
            rgba(0, 0, 0, 0.04) -10px 0 10px -5px;
        /* interaction */
        --accent-active: #45a29e;
        --accent-hover: #2d3d50;
    }

    :global(h1) {
        font-family: 'Oswald';
        font-weight: 700;
        font-size: 32px;
        margin-top: 0;
        margin-bottom: 0;
    }
    :global(h2) {
        font-family: 'Roboto';
        font-weight: 700;
        font-size: 20px;
    }
    :global(p) {
        margin-block-start: 0;
        margin-block-end: 0;
        font-family: 'Roboto';
    }
    :global(b),
    :global(strong) {
        font-family: 'Roboto Bold';
    }
    :global(i),
    :global(em) {
        font-family: 'Roboto Italic';
    }
    main {
        padding: 1em;
        height: 100%;
        margin: 0 auto;
    }
    :global(.main-container) {
        padding-left: 256px;
        box-sizing: border-box;
        padding-top: 8px;
        padding-bottom: 8px;
        background-color: #fff;
    }
    @media (max-width: 767px) {
        main {
            max-width: none;
        }

        :global(.main-container) {
            padding-left: 56px;
            padding-right: 0;
        }
    }
</style>

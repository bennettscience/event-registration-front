<script>
    // TODO: Rename all instances of 'Course' to 'Event' for more generic naming.

    import { onMount } from 'svelte';
    import page from 'page';

    import { user } from './store';

    import Navigation from './components/nav/Navigation.svelte';

    // Routing
    import Home from './pages/home.svelte';
    import Create from './pages/create.svelte';
    import Schedule from './pages/schedule.svelte';
    import Admin from './pages/admin.svelte';
    import Presenter from './pages/presenter.svelte';
    import Documents from './pages/documents.svelte';
    import Users from './pages/users.svelte';

    // set default component
    let current = Home;

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

    // TODO: Implement Observer role views, permissions.

    onMount(async () => {
        try {
            let req = await fetch('http://127.0.0.1:5000/getsession', {
                credentials: 'same-origin',
            });

            let data = await req.json();

            if (data.login === true) {
                $user = data.user;
                isAuthenticated = true;
            }
        } catch (err) {
            console.log(err);
        }
    });

    const login = async () => {
        try {
            let req = await fetch('/authorize/google', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'no-cors',
            });

            let data = await req.json();

            if (data.login == true) {
                // All users are authenticated at login. Special users have different permissions
                // and that is set with this check.
                isAuthenticated = true;
                if (data.user.role.id === 1) {
                    $user.isAdmin = true;
                } else if (data.user.role.id === 2) {
                    $user.isPresenter = true;
                } else if (data.user.role.id === 3) {
                    $user.isObserver = true;
                }

                $user = data.user;
            }
        } catch (err) {
            console.log(err);
        }
    };
</script>

<main>
    {#if isAuthenticated}
        <Navigation bind:isAuthenticated />
        <svelte:component this={current} bind:isAuthenticated />
    {:else}
        <h1>Log in</h1>
        <a href="/authorize/google">login with Google</a>
    {/if}
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Roboto:wght@300;700&display=swap');
    :root {
        /* Colors */
        --site-gray: #c5c6c7;
        --accent-blue: #0098fa;
        --accent-red: #e9164f;
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
        font-family: 'Roboto';
    }
    main {
        padding: 1em;
        height: 100%;
        margin: 0 auto;
    }
    :global(.main-container) {
        padding-left: 256px;
        padding-right: 362px;
        box-sizing: border-box;
        padding-top: 8px;
        padding-bottom: 8px;
        background-color: #fff;
    }
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

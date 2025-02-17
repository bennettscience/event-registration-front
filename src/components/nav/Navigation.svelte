<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    import MenuItem from './MenuItem.svelte';
    import { user } from '../../store.js';

    let menu;
    let current = 'home';
    export let isAuthenticated;

    const d = createEventDispatcher();

    // Show nav items based on user role
    const permissions = {
        User: ['home', 'schedule', 'documents', 'logout'],
        Observer: ['home', 'schedule', 'documents', 'logout'],
        Presenter: [
            'home',
            'schedule',
            'documents',
            'presenter',
            'create',
            'logout',
        ],
        SuperAdmin: [
            'home',
            'schedule',
            'documents',
            'admin',
            'users',
            'create',
            'logout',
        ],
    };

    const navItems = [
        { item: 'home', label: 'Home', href: '/', icon: 'home' },
        {
            item: 'schedule',
            label: 'My Schedule',
            href: '/schedule',
            icon: 'cal',
        },
        {
            item: 'documents',
            label: 'Documents',
            href: '/documents',
            icon: 'doc',
        },
        {
            item: 'presenter',
            label: 'Presenter Dashboard',
            href: '/presenter',
            icon: 'presenter',
        },
        {
            item: 'reports',
            label: 'Reports',
            href: '/reports',
            icon: 'reports',
        },
        {
            item: 'admin',
            label: 'Event Management',
            href: '/admin',
            icon: 'admin',
        },
        {
            item: 'users',
            label: 'User Management',
            href: '/people',
            icon: 'users',
        },
        {
            item: 'create',
            label: 'Create Event',
            href: '/create',
            icon: 'create',
        },
        { item: 'logout', label: 'Logout', href: '/logout', icon: 'logout' },
    ];

    const logout = () => {
        fetch('/logout', {
            credentials: 'same-origin',
        })
            .then(() => {
                isAuthenticated = false;
            })
            .catch((e) => {
                d('handleToast', {
                    isError: true,
                    toastBody: e,
                });
            });
    };

    if (isAuthenticated) {
        if ($user.role) {
            menu = navItems.filter((el) => {
                return permissions[$user.role['name']].indexOf(el.item) > -1;
            });
            menu = menu;
        } else {
            menu = navItems[0];
        }
    } else {
        menu = [navItems[0]];
    }

    let showMobileMenu = false;
    const handleMobileIconClick = () => (showMobileMenu = !showMobileMenu);

    // Media query matching
    const mediaQueryHandler = (e) => {
        // reset mobile state
        if (!e.matches) {
            showMobileMenu = false;
        }
    };

    // Attach the media query listener onmount
    onMount(() => {
        const mediaListener = window.matchMedia('(max-width: 767px)');
        mediaListener.addListener(mediaQueryHandler);
    });
</script>

<nav>
    <div class="inner">
        <div class={`navbar-list${showMobileMenu ? ' mobile' : ''}`}>
            {#each menu as item}
                <MenuItem bind:current {...item} />
            {/each}
        </div>
    </div>
</nav>

<style>
    nav {
        display: block;
        height: 100%;
        width: 256px;
        background-color: var(--site-dark);
        margin: 0;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
    }

    @media only screen and (max-width: 767px) {
        .mobile-icon {
            display: none;
        }

        .navbar-list {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        nav {
            width: 60px;
        }
    }
</style>

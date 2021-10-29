<script>
    import { createEventDispatcher } from 'svelte';
    import { user } from '../store';

    const d = createEventDispatcher();

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
        } catch (e) {
            d('handleToast', {
                isError: true,
                toastBody: e,
            });
        }
    };
</script>

<h1>Log in</h1>
<a href="/authorize/google">login with Google</a>

<style>
    /* your styles go here */
</style>

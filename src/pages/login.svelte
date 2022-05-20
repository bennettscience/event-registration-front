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

<h1>Site Unavailable</h1>
<p>
    During an upgrade to this site, the database was damaged and useres, events,
    and registrations were lost. The site will be unavaialable while we work to
    restore as much data as possible.
</p>
<p>
    If you have an upcoming event, your Google Calendar invitation is still
    current and should include virtual meeting links.
</p>
<p>
    We will restore upcoming events first and then re-enable the site to allow
    for new registrations. Then, we will begin working on restoring past events
    and registrations so PGPs can be created.
</p>
<p>
    If you need immediate help, please send an email to <a
        href="mailto:pd+eventsdown@elkhart.k12.in.us">Elkhart PD</a
    >and we'll help however we can. We're sorry for the inconvenience and
    appreciate your patience while we fix the issue.
</p>

<!-- <h1>Log in</h1>
<a href="/authorize/google">login with Google</a> -->
<style>
    /* your styles go here */
</style>

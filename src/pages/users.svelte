<script>
    import { user } from '../store.js';
    import { handleErrors } from '../utils.js';
    import Counter from '../components/admin/AdminCounter.svelte';
    import UserTable from '../components/UserTable.svelte';

    let userType;
    let users = [];

    let userTypes;
    let fields;

    const findUsers = async () => {
        let req = await fetch(`/users?user_type=${userType}`);
        users = await req.json();
    };
</script>

<section class="main-container">
    {#if $user.role.id !== 1}
        <p>
            Sorry, you don't have the right permissions to access this page. If
            you think this is incorrect,
            <a href="mailto:pd@elkhart.k12.in.us">let us know.</a>
        </p>
        <p><a href="/">Back home</a></p>
    {:else}
        <select bind:value={userType}>
            <option value="1">SuperAdmin</option>
            <option value="2">Presenters</option>
            <option value="3">Observers</option>
            <option value="4">Users</option>
        </select>
        <button on:click={findUsers}>Find users</button>
    {/if}
    <hr />
    {#if users.length > 0}
        <UserTable {users} {fields} />
    {/if}
</section>

<!-- markup (zero or more items) goes here -->
<style>
    .main-container {
        padding-right: 0;
    }
</style>

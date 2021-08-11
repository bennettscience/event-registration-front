<script>
    import { fly } from 'svelte/transition';
    import { user } from '../store.js';
    import { handleErrors } from '../utils.js';
    import UserTable from '../components/UserTable.svelte';
    import EditUserSubview from '../components/EditResourceSubview.svelte';

    let userType;
    let users = [];
    let fields;

    // sidebar props
    let dataTarget = '';
    let sidebarVisible = false;
    let userId;

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
        <UserTable
            {users}
            {fields}
            on:editUser={(e) => {
                sidebarVisible = true;
                dataTarget = 'user';
                userId = e.detail.userId;
            }}
        />
    {/if}
</section>
{#if sidebarVisible}
    <section class="course-detail" transition:fly={{ x: 200, duration: 500 }}>
        <p id="close" on:click={() => (sidebarVisible = false)}>
            <span>&times</span>Cancel
        </p>
        {#if userId !== null}
            <EditUserSubview
                on:success={() => {
                    sidebarVisible = false;
                }}
                resourceId={userId}
                bind:dataTarget
            />
        {/if}
    </section>
{/if}

<!-- markup (zero or more items) goes here -->
<style>
    .main-container {
        padding-right: 0;
    }
    .course-detail {
        width: 50%;
        z-index: 1000;
    }
</style>

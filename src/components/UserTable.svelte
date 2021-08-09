<script>
    import UserRow from './UserRow.svelte';
    export let users;
    export let isModalOpen;
</script>

<table>
    <thead>
        <th>Name</th>
        <th>Building</th>
        <th>Email</th>
        <th>Role</th>
        <th>Action</th>
    </thead>
    <tbody>
        {#if users.length > 0}
            {#each users as user}
                <UserRow {...user} on:editUser />
            {/each}
        {:else}
            <tr><td>No users to display.</td></tr>
        {/if}
    </tbody>
</table>

<style>
    tr:nth-child(even) {
        background-color: var(--site-gray);
    }

    table {
        border-collapse: collapse;
        border: 0;
    }
    thead th {
        background-color: #f8f8f8;
    }
    th,
    td {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 0.6rem;
        text-align: left;
        min-width: 6rem;
    }

    thead,
    tfoot {
        z-index: 1000;
        position: relative;
    }
    thead th {
        position: sticky;
        top: 0;
        background-clip: padding-box;
    }
    tfoot td {
        position: sticky;
        bottom: 0;
        background-color: #fff;
        vertical-align: middle;
        line-height: 3;
    }
    tfoot td span {
        height: 25px;
        border: 1px solid var(--site-dark);
        border-radius: 5px;
        padding: 8px;
        transition: all 0.25s ease-in-out;
    }
    tfoot td span:hover {
        cursor: pointer;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-color: var(--accent-blue);
    }
    tbody {
        z-index: 10;
        position: relative;
    }
</style>

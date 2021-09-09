<script>
    import LogTableRow from './LogTableRow.svelte';
    export let data;

    console.table(data);
</script>

<table>
    <thead>
        <th>Occurred</th>
        <th>User</th>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Data</th>
    </thead>
    <tbody>
        {#each data as item}
            <LogTableRow {...item} />
        {/each}
    </tbody>
</table>

<!-- markup (zero or more items) goes here -->
<style>
    table {
        background-color: var(--text-white);
        width: 100%;
        border-collapse: collapse;
        border: 0;
    }
    thead th {
        background-color: var(--text-white);
    }
    th {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 0.6rem;
        text-align: left;
        min-width: 6rem;
    }

    thead {
        z-index: 1000;
        position: relative;
    }
    thead th {
        position: sticky;
        top: 0;
        background-clip: padding-box;
    }
    tbody {
        z-index: 10;
        position: relative;
    }
</style>

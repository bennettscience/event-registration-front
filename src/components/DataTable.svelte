<script>
    import { createEventDispatcher } from 'svelte';
    import { formatDate } from '../utils.js';

    const d = createEventDispatcher();

    export let data;
    export let headers;
</script>

<table>
    <thead>
        {#each headers as head}
            <th>{head}</th>
        {/each}
    </thead>
    <tbody>
        {#each data as row}
            <tr
                on:click={() => {
                    d('getRegistered', {
                        courseId: row.id,
                        regs: row.registrations,
                        title: row.title,
                    });
                }}
            >
                <td class="selector">{row.title}</td>
                <td>{formatDate('starts', row.starts)}</td>
                <td>{row.course_size}</td>
                <td>{row.registrations.length}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    tr:nth-child(even) {
        background-color: var(--site-gray);
    }

    .selector {
        color: var(--accent-blue);
        text-decoration: underline;
    }
    .selector:hover {
        cursor: pointer;
    }

    table {
        border-collapse: collapse;
        border: 0;
    }
    th,
    td {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 8px 0 8px 8px;
        text-align: left;
    }
    tbody tr:last-child td {
        border-bottom: 0;
    }
    thead {
        z-index: 1000;
        position: relative;
    }
    th,
    td {
        padding: 0.6rem;
        min-width: 6rem;
        text-align: left;
        margin: 0;
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
    thead th {
        background-color: #f8f8f8;
    }
</style>

<script>
    import { formatDate } from '../../utils';
    export let occurred;
    export let endpoint;
    export let json_data;
    export let method;
    export let user;
</script>

<tr>
    <td>{occurred}</td>
    <td>{user.name}</td>
    <td>{method}</td>
    <td>{endpoint}</td>
    {#if json_data !== 'null'}
        <td
            ><pre><code>
            {JSON.stringify(json_data,null,2)}
        </code></pre></td
        >
    {/if}
</tr>

<!-- markup (zero or more items) goes here -->
<style>
    tr {
        box-sizing: border-box;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        transition: all 0.25s ease-in-out;
    }
    tr:hover {
        border-bottom: 1px solid var(--site-gray);
    }
    td {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 0.6rem;
        min-width: 6rem;
        text-align: left;
    }
</style>

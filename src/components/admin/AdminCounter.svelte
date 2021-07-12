<script>
    // Display a large number from a prop

    // Define which value to fetch
    export let label = '';
    export let count = 0;
    export let value = undefined;
    let w;
    let h;
    let size = 60;

    const values = {
        users: {
            label: 'Users',
            endpoint: '/users',
        },
        events: {
            label: 'Events',
            endpoint: '/courses',
        },
        presenters: {
            label: 'Presenters',
            endpoint: '/presenters',
        },
    };

    let target = values[value];

    async function getData() {
        let req = await fetch(target.endpoint);
        let result = await req.json();

        count = result.length;
        return count;
    }
</script>

<div class="counter" bind:clientHeight={h} bind:clientWidth={w}>
    {#if value}
        {#await getData()}
            <p>Loading...</p>
        {:then count}
            <span class="label">{target.label}</span>
            <span class="count" style="font-size: {size}px">{count}</span>
        {/await}
    {:else}
        <span class="label">{label}</span>
        <span class="count" style="font-size: {size}px">{count}</span>
    {/if}
</div>

<style>
    .counter {
        padding: 10px;
        border-radius: 5px;
        border: 3px solid var(--accent-blue);
        flex-grow: 1;
    }
    .label {
        display: block;
        width: 100%;
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 300;
        margin-bottom: 0;
        transform: scale(0.85, 1.2);
    }
    .count {
        display: block;
        text-align: center;
        font-weight: 800;
        padding: 0;
    }
</style>

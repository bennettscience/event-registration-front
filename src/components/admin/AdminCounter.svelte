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
            endpoint: '/courses?all=true',
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

<!-- 
    Using the $$props variable isn't great, but it's okay from time to time.  
    See the note on https://svelte.dev/docs#:~:text=%24%24props%20references%20all%20props%20that%20are%20passed%20to%20a%20component%2C%20including%20ones%20that%20are%20not%20declared%20with%20export.%20It%20is%20not%20generally%20recommended%2C%20as%20it%20is%20difficult%20for%20Svelte%20to%20optimise.
-->

<div class="{$$props.class} counter" bind:clientHeight={h} bind:clientWidth={w}>
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

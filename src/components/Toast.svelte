<script>
    import { fly } from 'svelte/transition';

    export let isError = false;
    export let toastBody;
</script>

<div
    class:error={isError}
    class="toast"
    transition:fly={{ y: 200, duration: 500 }}
>
    <p>{toastBody}</p>
</div>

<style>
    .error {
        background-color: var(--accent-red);
        border-color: var(--accent-red);
        color: var(--text-white);
    }
    .toast {
        background-color: var(--accent-green);
        color: var(--text-white);
        line-height: 1;
        position: fixed;
        bottom: 0;
        right: 0;
        margin-right: 25px;
        margin-bottom: 25px;
        border: 1px solid var(--site-gray);
        border-radius: 5px;
        padding: 3px 25px;
    }
</style>

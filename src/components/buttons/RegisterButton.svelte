<script>
    import { user } from '../../store';
    import { createEventDispatcher } from 'svelte';
    import Loader from '../Loader.svelte';

    export let id;
    export let disabled;
    let showLoader = false;

    const d = createEventDispatcher();

    async function handleClick() {
        disabled = true;
        showLoader = !showLoader;
        let req = await fetch(`/courses/${id}/registrations/${$user.id}`, {
            method: 'POST',
        });
        let response = await req.json();

        // update the state of the course
        if (response.message === 'success') {
            d('register', {
                courseId: id,
            });
        }
        showLoader = !showLoader;
    }
</script>

<span class:disabled role="button" on:click={handleClick}>
    {#if showLoader}
        <Loader />
    {:else if disabled}
        Event full
    {:else}
        Register
    {/if}
</span>

<style>
    span {
        display: flex;
        font-weight: 700;
        font-family: 'Roboto', Arial, Helvetica, sans-serif;
        font-size: 20px;
        border-radius: 5px;
        background-color: var(--accent-blue);
        color: var(--text-white);
        width: 50%;
        height: 36px;
        margin: 0 auto;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition: 0.125s all ease-in-out;
    }

    span:hover {
        box-shadow: var(--active-shadow);
    }
    .disabled {
        background-color: var(--site-gray);
        pointer-events: none;
    }
</style>

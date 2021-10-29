<script>
    import { user } from '../../store';
    import { createEventDispatcher } from 'svelte';
    import Loader from '../Loader.svelte';

    export let id;
    let showLoader = false;

    const d = createEventDispatcher();

    async function handleCancel() {
        showLoader = !showLoader;
        let req = await fetch(`/courses/${id}/registrations/${$user.id}`, {
            method: 'DELETE',
        });
        let response = await req.json();
        if (response.message === 'Success') {
            d('cancel', {
                courseId: id,
            });
        }
        showLoader = !showLoader;
    }
</script>

<span role="button" on:click={handleCancel}>
    {#if showLoader}
        <Loader />
    {:else}
        Cancel
    {/if}
</span>

<style>
    span {
        display: flex;
        font-weight: 700;
        font-family: 'Roboto', Arial, Helvetica, sans-serif;
        font-size: 20px;
        border-radius: 5px;
        background-color: var(--accent-red);
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
</style>

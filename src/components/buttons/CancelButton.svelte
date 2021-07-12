<script>
    import { user } from '../../store';
    import { createEventDispatcher } from 'svelte';

    export let id;
    export let disabled;

    const d = createEventDispatcher();

    async function handleCancel() {
        let req = await fetch(`/courses/${id}/registrations/${$user.id}`, {
            method: 'DELETE',
        });
        let response = await req.json();
        if (response.message === 'Success') {
            d('cancel', {
                courseId: id,
            });
        }
    }
</script>

<span class:disabled role="button" on:click={handleCancel}> Cancel </span>

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
    .disabled {
        background-color: var(--site-gray);
    }
    .disabled:hover {
        cursor: not-allowed;
    }
</style>

<script>
    import { user } from '../../store';
    import { createEventDispatcher } from 'svelte';
    import Loader from '../Loader.svelte';
    import Form from '../FormWrapper.svelte';

    export let id;
    export let disabled;

    let showLoader = false;
    let fields = [
        {
            type: 'Radio',
            value: false,
            label: 'Do you need an accommodation?',
            name: 'acc_required',
            options: [
                {
                    text: 'Yes',
                    val: true,
                },
                {
                    text: 'No',
                    val: false,
                },
            ],
        },
        {
            type: 'Input',
            vaue: '',
            label: 'Details',
            placeholder: 'Accommodation details...',
            name: 'acc_note',
        },
    ];

    const d = createEventDispatcher();

    async function handleSubmit(data) {
        disabled = true;
        showLoader = !showLoader;

        let req = await fetch(`/courses/${id}/registrations/${$user.id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
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

<Form {fields} onSubmit={(body) => handleSubmit(body)} />

<!-- <span class:disabled role="button" on:click={handleClick}>
    {#if showLoader}
        <Loader />
    {:else if disabled}
        Event full
    {:else}
        Register
    {/if}
</span> -->
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

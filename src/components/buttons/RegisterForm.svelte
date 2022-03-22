<script>
    import { user } from '../../store';
    import { createEventDispatcher } from 'svelte';
    import Loader from '../Loader.svelte';
    import Form from '../FormWrapper.svelte';

    export let id;
    export let disabled;

    let buttonLabel = 'Register';

    if (disabled) {
        buttonLabel = 'Event Full';
    }

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

<Form
    {fields}
    {disabled}
    {buttonLabel}
    onSubmit={(body) => handleSubmit(body)}
/>

<style>
</style>

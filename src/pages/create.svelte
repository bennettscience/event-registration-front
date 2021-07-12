<script>
    import { onMount } from 'svelte';
    import FormWrapper from '../components/FormWrapper.svelte';
    import Modal from '../components/ModalView.svelte';
    import { fields } from '../assets/createCourseFields.js';

    let locations;

    const getLocations = async () => {
        let req = await fetch('/locations');
        let data = await req.json();

        locations = data.map(({ id, name }) => ({
            id: id,
            value: id,
            label: name,
        }));

        fields.splice(3, 0, {
            name: 'location_id',
            id: 'location-id',
            type: 'Select',
            value: '',
            options: locations,
            label: 'Location',
        });

        return fields;
    };

    let result = {};

    async function handleSubmit(course) {
        // Python has timestamps in seconds, JS is in millisecons. Convert
        // on the client before submitting.
        course.starts = new Date(course.starts).getTime() / 1000;
        course.ends = new Date(course.ends).getTime() / 1000;

        // TODO: Wrap in handleError
        let req = await fetch(`/courses`, {
            method: 'POST',
            body: JSON.stringify(course),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let response = await req.json();
        result = response;
    }
</script>

<section class="main-container">
    {#if $user.role.id !== 1 || $user.role.id !== 2}
        <p>
            Sorry, you don't have the right permissions to access this page. If
            you think this is incorrect,
            <a href="mailto:pd@elkhart.k12.in.us">let us know.</a>
        </p>
        <p><a href="/">Back home</a></p>
    {:else}
        <Modal>
            <div slot="modal-content">
                This isthe modal contenet inserted into the slot
            </div>
        </Modal>
        <h1>Add an Event</h1>
        {#await getLocations() then fields}
            <FormWrapper {fields} onSubmit={(body) => handleSubmit(body)} />
            <pre><code>{JSON.stringify(result, 0, 2)}</code></pre>
        {/await}
    {/if}
</section>

<!-- TODO: Style the form -->
<style>
    .main-container {
        padding-right: 0;
    }
</style>

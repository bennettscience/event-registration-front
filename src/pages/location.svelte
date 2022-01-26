<script>
    import { onMount } from 'svelte';
    import { locations, user } from '../store.js';
    import Form from '../components/FormWrapper.svelte';
    import Loader from '../components/Loader.svelte';
    import page from 'page';

    let fields = [];
    let showLoader = false;

    onMount(async () => {
        let request = await fetch('/locations?locationType=physical');
        let result = await request.json();

        // Map the fields to name and ID only.
        const allowed = ['name', 'id'];

        $locations = result
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((item) =>
                allowed.reduce((idx, current) => {
                    idx[current] = item[current];
                    return { value: item.id, label: item.name };
                }, {}),
            );

        fields = [
            {
                type: 'Select',
                name: 'location_id',
                value: location.id,
                label: '',
                options: $locations,
            },
        ];
    });

    const handleSubmit = async (data) => {
        // post the user location to the backend
        showLoader = true;
        try {
            let req = await fetch(`/users/${$user.id}/locations`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let result = await req.json();
            showLoader = false;
            page('/');
        } catch (err) {
            console.log(err);
        }
    };
</script>

<section class="main-container">
    <h1>Update your location</h1>
    <hr />
    <p>
        Hi {$user.name.split(' ')[0]}. We need to do a quick update of your
        building assignment. Select your building from the list and then submit.
    </p>
    <p>
        <Form {fields} onSubmit={(body) => handleSubmit(body)} />
    </p>
    {#if showLoader}
        <Loader dark={true} />
    {/if}
</section>

<!-- markup (zero or more items) goes here -->
<style>
</style>

<script>
    export let userId;
    export let events;
    export let registrations;

    let eventId;
    let registrationIds = registrations.map((el) => el.course.id);

    let available = events.filter(
        (event) => !registrationIds.includes(event.id),
    );

    const registerUser = async () => {
        let resp = await fetch(`/courses/${eventId}/registrations/${userId}`, {
            method: 'POST',
        });
        if (resp.ok) {
            let result = await resp.json();
            registrations = [...registrations, result.data];
        }
    };
</script>

<section>
    <b>Current registrations</b>
    {#if registrations}
        <ul>
            {#each registrations as registration}
                <li>{registration.course.title}</li>
            {/each}
        </ul>
    {/if}
    {#if events}
        <b>Add to event</b>
        <select bind:value={eventId}>
            {#each available as event}
                <option value={event.id}>{event.title}</option>
            {/each}
        </select>
        <span role="button" on:click={registerUser}>Add Event</span>
    {/if}
</section>

<style>
    select {
        margin: 10px 0;
    }
    span {
        position: absolute;
        right: 20px;
        border: 1px solid var(--site-dark);
        border-radius: 5px;
        padding: 10px 30px;
        transition: all 0.25s ease-in-out;
    }
    span:hover {
        cursor: pointer;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-color: var(--accent-blue);
    }
</style>

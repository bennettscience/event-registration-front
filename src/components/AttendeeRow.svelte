<script>
    import { createEventDispatcher } from 'svelte';
    import { circleCheck, close } from '../assets/icons.js';
    export let user;
    export let attended;
    export let courseId;

    const d = createEventDispatcher();

    const updateAttended = async () => {
        console.log(courseId, user.id);
        let req = await fetch(`/courses/${courseId}/registrations/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        let resp = await req.json();
        attended = resp.attended;
        d('userAttended', { userId: user.id, attended: attended });
    };
</script>

<tr data-id={user.id} on:click={updateAttended}>
    <td>{user.name}</td>
    <td>{user.location.name}</td>
    <td>{user.email}</td>
    <td
        >{#if attended}
            <svg
                fill="none"
                viewBox="0 0 24 24"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
            >
                {@html circleCheck}
            </svg>
        {:else}<svg
                fill="none"
                viewBox="0 0 24 24"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg">{@html close}</svg
            >
        {/if}
    </td>
</tr>

<style>
    tr:nth-child(even) {
        background-color: var(--site-gray);
    }

    td {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 0.6rem;
        min-width: 6rem;
        text-align: left;
    }
    tr > td:last-of-type:hover {
        cursor: pointer;
    }
</style>

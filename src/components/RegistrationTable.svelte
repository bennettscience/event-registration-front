<script>
    import AttendeeRow from './AttendeeRow.svelte';
    export let courseId;
    export let registrations;

    const userAttended = (e) => {
        let registration = registrations.find(
            (el) => el.user.id === e.detail.userId,
        );
        registration.attended = e.detail.attended;
        registrations = registrations;
    };

    const updateAllAttended = async () => {
        let userIds = registrations
            .filter((el) => !el.attended)
            .map((obj) => obj.user.id);

        let req = await fetch(`/courses/${courseId}/registrations`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_ids: userIds }),
        });
        let resp = await req.json();
        registrations = registrations;
    };
</script>

<table>
    <thead>
        <th>Name</th>
        <th>Building</th>
        <th>Email</th>
        <th>Attended</th>
    </thead>
    <tbody>
        {#if registrations.length > 0}
            {#each registrations as user}
                <AttendeeRow
                    {...user}
                    bind:courseId
                    on:userAttended={userAttended}
                />
            {/each}
        {:else}
            <tr><td>No registrations to display.</td></tr>
        {/if}
    </tbody>
    {#if registrations.length > 0}
        <tfoot>
            <tr>
                <td />
                <td />
                <td>
                    <!-- <span role="button">Email Attendees</span> -->
                </td>
                <td
                    ><span role="button" on:click={updateAllAttended}
                        >Mark All Attended</span
                    ></td
                >
            </tr>
        </tfoot>
    {/if}
</table>

<style>
    tr:nth-child(even) {
        background-color: var(--site-gray);
    }

    table {
        border-collapse: collapse;
        border: 0;
    }
    thead th {
        background-color: #f8f8f8;
    }
    th,
    td {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 0.6rem;
        text-align: left;
        min-width: 6rem;
    }

    thead,
    tfoot {
        z-index: 1000;
        position: relative;
    }
    thead th {
        position: sticky;
        top: 0;
        background-clip: padding-box;
    }
    tfoot td {
        position: sticky;
        bottom: 0;
        background-color: #fff;
        vertical-align: middle;
        line-height: 3;
    }
    tfoot td span {
        height: 25px;
        border: 1px solid var(--site-dark);
        border-radius: 5px;
        padding: 8px;
        transition: all 0.25s ease-in-out;
    }
    tfoot td span:hover {
        cursor: pointer;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-color: var(--accent-blue);
    }
    tbody {
        z-index: 10;
        position: relative;
    }
</style>

<script>
    import { user } from '../store.js';
    import { formatDate, handleErrors } from '../utils.js';

    let events;
    let totalRegistrations;
    let total = 0;

    // Admins can get to documents for a user through the admin console.

    const headers = ['Title', 'Start', 'PGPs', 'Print'];

    async function getConfirmedEvents() {
        // User ID validation for the request is done on the server for the current signed in user.
        let req = handleErrors(await fetch(`users/${$user.id}/confirmed`));
        let data = await req.json();

        let regs = handleErrors(await fetch(`users/${$user.id}/registrations`));
        let registrations = await regs.json();

        events = data.map((event) => {
            event.course.state = 'attended';
            total += event.course.total;
            return event;
        });

        totalRegistrations = registrations.length;

        return events;
    }
</script>

<section class="main-container">
    <h1>My Documents</h1>
    <p>
        This page holds documentation for all PD which has been confirmed by the
        presenter. You are responsible for saving and/or printing documents
        created by this page. You can vist this page at any time to create new
        PDFs for your records.
    </p>
    <section class="document-meta">
        <p>Total registrations: {totalRegistrations}</p>
        <p>Total PGP: {total}</p>
        <a href="/users/{$user.id}/documents/create" target="_blank"
            >Print Summary</a
        >
    </section>
    <section class="document-table">
        <h2>My Events</h2>
        <table>
            <thead>
                <th>Event</th>
                <th>Date</th>
                <th>PGPs</th>
                <th>Action</th>
            </thead>
            <tbody>
                {#await getConfirmedEvents() then events}
                    {#each events as event}
                        <tr>
                            <td>{event.course.title}</td>
                            <td>{formatDate('starts', event.course.starts)}</td>
                            <td>{event.course.total}</td>
                            <td
                                ><a
                                    href="/users/{$user.id}/documents/create/{event
                                        .course.id}"
                                    target="_blank">Print</a
                                ></td
                            >
                        </tr>
                    {/each}
                {/await}
            </tbody>
        </table>
    </section>
</section>

<style>
    .main-container {
        padding-right: 0;
    }

    .document-meta {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        padding: 15px;
        border-top: 2px solid var(--site-gray);
        border-bottom: 2px solid var(--site-gray);
    }

    .document-meta a {
        padding: 1em;
        display: block;
        border: 2px solid var(--accent-blue);
        border-radius: 5px;
        transition: 0.25s all ease-in-out;
    }

    .document-meta a:hover {
        background-color: var(--accent-blue);
        color: var(--text-white);
    }

    table {
        width: 100%;
        table-layout: fixed;
        text-align: left;
    }

    table thead th {
        padding-left: 5px;
    }

    table tbody tr {
        line-height: 1.5;
    }

    table tbody tr td {
        padding: 5px;
    }
</style>

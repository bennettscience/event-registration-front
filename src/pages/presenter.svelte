<script>
    import { fly } from 'svelte/transition';
    import { user } from '../store';
    import DataTable from '../components/DataTable.svelte';
    import RegistrationTable from '../components/RegistrationTable.svelte';
    import EditEventSubview from '../components/EditEventSubview.svelte';

    export let isAuthenticated;

    let currentEvent = 'Select an event to load registrations';
    let registrations = [];
    let courseId = null;
    let visible = false;

    const showRegistered = (e) => {
        registrations = e.detail.regs;
        courseId = e.detail.courseId;
        currentEvent = e.detail.title;
    };

    const courseHeaders = [
        'Event',
        'Start Date',
        'Max Attendees',
        'Registrations',
    ];

    async function getCourses() {
        let req = await fetch(`/users/${$user.id}/presenting`);
        let data = await req.json();

        data.map((el) => {
            el['state'] = 'registered';
            return el;
        });

        return data;
    }

    const editCourse = () => {
        console.log(courseId);
    };
</script>

<section class="main-container">
    {#if $user.role.id !== 2}
        <p>
            Sorry, you don't have the right permissions to access this page. If
            you think this is incorrect,
            <a href="mailto:pd@elkhart.k12.in.us">let us know.</a>
        </p>
        <p><a href="/">Back home</a></p>
    {:else}
        <section class="table courses">
            {#await getCourses()}
                <p>Loading...</p>
            {:then courses}
                <DataTable
                    data={courses}
                    headers={courseHeaders}
                    on:getRegistered={showRegistered}
                    on:editCourse={editCourse}
                    bind:currentEvent
                />
            {/await}
        </section>
        <section class="course-heading">
            <h2>{currentEvent}</h2>
            {#if courseId !== null}
                <span
                    class="form-toggle"
                    role="button"
                    on:click={() => (visible = true)}>Edit</span
                >
            {/if}
        </section>

        <section class="table registrations">
            <RegistrationTable {registrations} bind:courseId />
        </section>

        {#if visible}
            <section
                class="course-detail"
                transition:fly={{ x: 200, duration: 500 }}
            >
                {#if courseId !== null}
                    <EditEventSubview
                        on:success={() => (visible = false)}
                        {courseId}
                    />
                {/if}
                <span
                    role="button"
                    class="form-toggle"
                    on:click={() => (visible = false)}>Cancel</span
                >
            </section>
        {/if}
    {/if}
</section>

<style>
    .main-container {
        padding-right: 0;
    }
    section {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .table {
        height: 300px;
        overflow: scroll;
    }

    .course-detail {
        z-index: 1000;
    }

    .registrations {
        height: 400px;
    }

    .course-heading {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
    }

    .course-heading h2 {
        margin-right: 50px;
    }

    .form-toggle {
        padding: 5px 10px;
        border: 1px solid var(--site-dark);
        border-radius: 5px;
        transition: all 0.25s ease-in-out;
    }

    .form-toggle:hover {
        cursor: pointer;
        background-color: var(--site-dark);
        color: var(--text-white);
    }
</style>

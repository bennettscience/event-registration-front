<script>
    import { fly } from 'svelte/transition';
    import { user } from '../store';
    import DataTable from '../components/DataTable.svelte';
    import RegistrationTable from '../components/RegistrationTable.svelte';
    import EditEventSubview from '../components/EditResourceSubview.svelte';

    export let isAuthenticated;

    let currentEvent = 'Select an event to load registrations';
    let dataTarget;
    let registrations = [];
    let courseId = null;
    let result = {};
    let sidebarVisible = false;
    let courses;

    const showRegistered = (e) => {
        registrations = e.detail.registrations.sort((reg1, reg2) =>
            reg1.user.name.split(' ')[1] > reg2.user.name.split(' ')[1]
                ? 1
                : -1,
        );
        courseId = e.detail.id;
        currentEvent = e.detail.title;
        result = e.detail;
    };

    const courseHeaders = [
        'Event',
        'Start Date',
        'Max Attendees',
        'Registrations',
    ];

    async function getCourses() {
        let req = await fetch(`/users/${$user.id}/presenting`);
        courses = await req.json();

        courses.map((el) => {
            el['state'] = 'registered';
            return el;
        });

        courses = courses.sort((course1, course2) =>
            course1.starts > course2.starts ? 1 : -1,
        );

        return courses;
    }

    // TODO: Work into a utility script to handle any course ID
    const changeCourseState = async () => {
        let response;
        let req = await fetch(`/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify({ active: !result.active }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (req.ok) {
            response = await req.json();
            result = response.course;
            return response;
        }
    };

    $: courses;
</script>

<section
    on:keydown={(e) => {
        if (e.key === 'Escape') {
            sidebarVisible = false;
        }
    }}
    class="main-container"
>
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
                    bind:currentEvent
                />
            {/await}
        </section>
        <section class="course-heading">
            <h2>{currentEvent}</h2>
            {#if courseId !== null}
                <span
                    tabindex="0"
                    class="form-toggle"
                    role="button"
                    on:click={() => {
                        sidebarVisible = true;
                        dataTarget = 'duplicate';
                    }}>Duplicate Event</span
                >
                <span
                    tabindex="0"
                    class="form-toggle"
                    role="button"
                    on:click={() => {
                        sidebarVisible = true;
                        dataTarget = 'course';
                    }}>Edit Event</span
                >
                <span
                    tabindex="0"
                    class="form-toggle"
                    role="button"
                    on:click={() => {
                        sidebarVisible = true;
                        dataTarget = 'presenters';
                    }}>Edit Presenters</span
                >
                <span
                    tabindex="0"
                    class="form-toggle"
                    role="button"
                    on:click={() => {
                        sidebarVisible = true;
                        dataTarget = 'links';
                    }}>Edit Links</span
                >
                <span
                    tabindex="0"
                    class="form-toggle"
                    class:cancelled={result.active}
                    role="button"
                    on:click={changeCourseState}
                    >{#if result.active}Cancel Event{:else}Activate Event{/if}</span
                >
            {/if}
        </section>

        <section class="table registrations">
            <RegistrationTable {registrations} bind:courseId />
        </section>

        {#if sidebarVisible}
            <section
                class="course-detail"
                transition:fly={{ x: 200, duration: 500 }}
            >
                <p id="close" on:click={() => (sidebarVisible = false)}>
                    <span>&times</span>Cancel
                </p>
                {#if courseId !== null}
                    <EditEventSubview
                        on:success={async () => {
                            sidebarVisible = false;
                            courses = await getCourses();
                        }}
                        resourceId={courseId}
                        bind:dataTarget
                    />
                {/if}
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
        width: 50%;
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
        gap: 20px;
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
    .cancelled:hover {
        border-color: var(--accent-red);
        background-color: var(--accent-red);
    }
</style>

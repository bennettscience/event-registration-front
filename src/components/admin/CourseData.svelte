<script>
    import { createEventDispatcher } from 'svelte';
    import { formatDate } from '../../utils.js';
    import RegistrationTable from '../RegistrationTable.svelte';

    export let courseId;

    let value = 0;
    let options;
    let rate;
    let registrations = [];
    let result = {};

    const d = createEventDispatcher();

    $: rate = getRate(registrations);

    async function getCourses() {
        // Get all courses and populate a select
        let req = await fetch('/courses');
        let data = await req.json();

        options = data.map(({ id, title, starts }) => {
            starts = formatDate('dateOnly', starts);
            return {
                id: id,
                title: title,
                starts: starts,
            };
        });

        return options;
    }

    const getRate = function (registrations) {
        let attended = registrations.filter((el) => el.attended);
        if (registrations.length === 0) return 'N/A';
        return (attended.length / registrations.length) * 100;
    };

    async function handleChange() {
        let req = await fetch(`/courses/${value}`);
        let data = await req.json();

        registrations = data.registrations.sort((reg1, reg2) =>
            reg1.user.name.split(' ')[1] > reg2.user.name.split(' ')[1]
                ? 1
                : -1,
        );
        courseId = data.id;
        result = data;
        // rate = getRate(registrations);
    }

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
</script>

<section class="course-data">
    <div class="course-select">
        {#await getCourses()}
            <p>Loading...</p>
        {:then courses}
            <select tabindex="0" bind:value on:change={handleChange}>
                <option value="" readonly="true" hidden="true" selected
                    >Select an event</option
                >
                {#each courses as course}
                    <option value={course.id}
                        >{course.starts} - {course.title}</option
                    >
                {/each}
            </select>
        {:catch}
            <p>Error fetching courses</p>
        {/await}
    </div>
    <section class="table">
        <RegistrationTable {registrations} bind:courseId />
    </section>
    {#if courseId}
        <section class="snapshot">
            <!-- <Counter
                class="snapshot-counter"
                label="Attendance rate"
                count={rate}
            /> -->

            <span
                tabindex="0"
                class="form-toggle"
                role="button"
                on:click={d('editCourse', { courseId: courseId })}
                >Edit Details</span
            >
            <span
                tabindex="0"
                class="form-toggle"
                role="button"
                on:click={d('editPresenters', { courseId: courseId })}
                >Edit Presenters</span
            >
            <span
                tabindex="0"
                class="form-toggle"
                role="button"
                on:click={d('editLinks', { courseId: courseId })}
                >Edit Links</span
            >
            <span
                tabindex="0"
                id="logs"
                role="button"
                on:click={d('getLogs', { courseId: courseId })}
                >View Event Logs</span
            >
            <span tabindex="0" role="button" on:click={changeCourseState}
                >{#if result.active}Cancel Event{:else}Activate Event{/if}</span
            >
            <span
                tabindex="0"
                id="delete"
                role="button"
                on:click={d('deleteCourse', { courseId: courseId })}
                >Delete Event</span
            >
        </section>
    {/if}
</section>

<style>
    .course-data {
        display: grid;
        grid-template-areas: 'select snapshot' 'registrations snapshot';
        grid-gap: 10px;
    }
    .course-select {
        grid-area: select;
    }
    .table {
        grid-area: registrations;
    }
    .snapshot {
        grid-area: snapshot;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .snapshot :global(.snapshot-counter) {
        flex-grow: 0;
    }
    span {
        border: 1px solid var(--site-dark);
        border-radius: 5px;
        padding: 10px;
        transition: all 0.25s ease-in-out;
    }
    span:hover {
        cursor: pointer;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-color: var(--accent-blue);
    }
    #delete {
        background-color: var(--accent-red);
        border-color: var(--accent-red);
        color: var(--text-white);
        transition: all 0.25s ease-in-out;
    }
    #delete:hover {
        background-color: var(--text-white);
        color: var(--accent-red);
    }
</style>

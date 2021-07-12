<script>
    import { fly } from 'svelte/transition';
    import RegistrationTable from '../RegistrationTable.svelte';
    import Counter from '../admin/AdminCounter.svelte';
    import EditEventSubview from '../EditEventSubview.svelte';

    let value = 0;
    let options;
    let rate;
    let visible = false;

    let courseId;
    let registrations = [];

    $: rate = getRate(registrations);

    async function getCourses() {
        // Get all courses and populate a select
        let req = await fetch('/courses');
        let data = await req.json();

        console.log(data);

        options = data.map(({ id, title }) => ({ id, title }));

        return options;
    }

    const getRate = function (registrations) {
        let attended = registrations.filter((el) => el.attended);
        return (attended.length / registrations.length) * 100;
    };

    async function handleChange() {
        let req = await fetch(`/courses/${value}`);
        let data = await req.json();
        console.log(data);

        registrations = data.registrations;
        courseId = data.id;
        result = data;
        // rate = getRate(registrations);
    }

    let result = {};
</script>

<section class="course-data">
    <div class="course-select">
        {#await getCourses()}
            <p>Loading...</p>
        {:then courses}
            <select bind:value on:change={handleChange}>
                <option value="" readonly="true" hidden="true" selected
                    >Select an event</option
                >
                {#each courses as course}
                    <option value={course.id}>{course.title}</option>
                {/each}
            </select>
        {:catch}
            <p>Error fetching courses</p>
        {/await}
    </div>
    {#if registrations.length > 0}
        <section class="table">
            <RegistrationTable {registrations} bind:courseId />
        </section>
        <section class="snapshot">
            <Counter label="Attendance rate" count={rate} />
            {#if courseId !== null}
                <span
                    class="form-toggle"
                    role="button"
                    on:click={() => (visible = true)}>Edit</span
                >
            {/if}
        </section>
    {:else}
        <section class="table">
            <pre><code>{JSON.stringify(result, 0, 2)}</code></pre>
        </section>
    {/if}
    {#if visible}
        <section
            class="course-detail"
            transition:fly={{ x: 200, duration: 500 }}
        >
            {#if courseId !== null}
                <EditEventSubview {courseId} />
            {/if}
            <span
                role="button"
                class="form-toggle"
                on:click={() => (visible = false)}>Cancel</span
            >
        </section>
    {/if}
</section>

<style>
    .course-data {
        display: grid;
        grid-template-areas: 'select .' 'registrations snapshot';
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
        flex-basis: 0;
        flex-direction: column;
        gap: 16px;
    }
    span {
        flex-grow: 1;
        height: 25px;
        border: 1px solid var(--site-dark);
        border-radius: 5px;
        padding: 8px;
        transition: all 0.25s ease-in-out;
    }
    span:hover {
        cursor: pointer;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-color: var(--accent-blue);
    }
</style>

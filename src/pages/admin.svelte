<script>
    import { fly } from 'svelte/transition';
    import { user } from '../store';
    import Counter from '../components/admin/AdminCounter.svelte';
    import CourseData from '../components/admin/CourseData.svelte';
    import EditEventSubview from '../components/EditEventSubview.svelte';

    export let isAuthenticated;
    let dataTarget = '';
    let sidebarVisible = false;
    let courseId;

    // TODO: Area for editing users. Needs to:
    //  - Read/Write user account details
    //  - Read user docs
    //  - Read/write presenter account details
    //  - read/write all courses
    // let users;
</script>

<section class="main-container">
    {#if $user.role.id !== 1}
        <p>
            Sorry, you don't have the right permissions to access this page. If
            you think this is incorrect,
            <a href="mailto:pd@elkhart.k12.in.us">let us know.</a>
        </p>
        <p><a href="/">Back home</a></p>
    {:else}
        <section class="counters">
            <Counter value="users" />
            <Counter value="events" />
            <Counter value="presenters" />
        </section>
        <hr />
        <!-- This section shows information on any event in the database. The event details can all be
        updated by an administrator. They can also edit event participation data. -->
        <section class="course-data">
            <CourseData
                bind:courseId
                on:editCourse={() => {
                    sidebarVisible = true;
                    dataTarget = 'course';
                }}
                on:editPresenters={() => {
                    (sidebarVisible = true), (dataTarget = 'presenters');
                }}
                on:editLinks={() => {
                    (sidebarVisible = true), (dataTarget = 'links');
                }}
            />
        </section>
    {/if}
</section>
{#if sidebarVisible}
    <section class="course-detail" transition:fly={{ x: 200, duration: 500 }}>
        <p id="close" on:click={() => (sidebarVisible = false)}>
            <span>&times</span>Cancel
        </p>
        {#if courseId !== null}
            <!-- TODO: Make this big to update all items -->
            <EditEventSubview
                on:success={() => (sidebarVisible = false)}
                {courseId}
                bind:dataTarget
            />
        {/if}
    </section>
{/if}

<style>
    .counters {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        gap: 16px;
    }
    .main-container {
        padding-right: 0;
    }
    .course-detail {
        width: 50%;
        z-index: 1000;
    }
</style>

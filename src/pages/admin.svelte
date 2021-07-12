<script>
    import { user } from '../store';
    import Counter from '../components/admin/AdminCounter.svelte';
    import CourseData from '../components/admin/CourseData.svelte';

    export let isAuthenticated;

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
            <CourseData />
        </section>
    {/if}
</section>

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
</style>

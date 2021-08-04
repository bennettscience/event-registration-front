<script>
    // TODO: This mirrors the home page pretty closely. How can it be changed to be more unique or helpful?
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { courseDetail, courseDetailInitial, user } from '../store.js';
    import Course from '../components/Course.svelte';
    import CourseDetails from '../components/CourseDetails.svelte';

    let sidebarVisible = false;

    onMount(() => ($courseDetail = courseDetailInitial));

    async function getUserCourses() {
        let req = await fetch(`/users/${$user.id}/registrations`);
        let data = await req.json();

        let courseAttending = data.map((course) => {
            console.log(course);
            if (course.attended) {
                course.course['state'] = 'attended';
            } else {
                course.course['state'] = 'registered';
            }
            // TODO: This is a _nasty_ hack to handle user logic in courses.
            // The CourseDetails component relies on this key for displaying actions.
            course.course['available'] = 1;
            return course.course;
        });
        console.log(courseAttending);
        return courseAttending;
    }
</script>

<section class="main-container">
    {#await getUserCourses()}
        <p>Fetching...</p>
    {:then courses}
        {#each courses as course}
            <Course
                {...course}
                on:showSidebar={() => {
                    sidebarVisible = !sidebarVisible;
                }}
            />
        {/each}
    {:catch error}
        <p>{error.message}</p>
    {/await}
</section>
{#if sidebarVisible}
    <section class="course-detail" transition:fly={{ x: 200, duration: 500 }}>
        <p
            id="close"
            on:click={() => {
                sidebarVisible = false;
                $courseDetail = courseDetailInitial;
            }}
        >
            <span>&times</span>Close
        </p>
        <CourseDetails
            on:hideSidebar={() => {
                sidebarVisible = !sidebarVisible;
                $courseDetail = courseDetailInitial;
            }}
        />
    </section>
{/if}

<style>
</style>

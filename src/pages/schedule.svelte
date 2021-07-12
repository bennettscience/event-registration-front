<script>
    // TODO: This mirrors the home page pretty closely. How can it be changed to be more unique or helpful?
    import { onMount } from 'svelte';
    import { courseDetail, user } from '../store.js';
    import Course from '../components/Course.svelte';
    import CourseDetails from '../components/CourseDetails.svelte';

    onMount(() => ($courseDetail = {}));

    async function getUserCourses() {
        let req = await fetch(`/users/${$user.id}/registrations`);
        let data = await req.json();

        let flat = data.map((course) => {
            if (course.attended) {
                course.course['state'] = 'attended';
            } else {
                course.course['state'] = 'registered';
            }
            return course.course;
        });

        console.log(flat);
        return flat;
    }
</script>

<section class="main-container">
    {#await getUserCourses()}
        <p>Fetching...</p>
    {:then courses}
        {#each courses as course}
            <Course {...course} />
        {/each}
    {:catch error}
        <p>{error.message}</p>
    {/await}
</section>
<section class="course-detail">
    {#if $courseDetail && Object.keys($courseDetail).length === 0 && $courseDetail.constructor === Object}
        <h1>Select a course from the list.</h1>
    {:else}
        <CourseDetails />
    {/if}
</section>

<style>
</style>

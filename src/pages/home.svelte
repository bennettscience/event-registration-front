<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Course from '../components/Course.svelte';
    import CourseDetails from '../components/CourseDetails.svelte';
    import { courses, courseDetail } from '../store.js';

    const d = createEventDispatcher();

    onMount(() => {
        $courseDetail = {};
        getCourses();
    });

    const getUser = async () => {
        let req = await fetch('/getsession');
        let data = await req.json();

        return data;
    };

    const getCourses = async () => {
        let user = await getUser();
        const req = await fetch('/courses');
        const userReq = await fetch(`/users/${user.user.id}/registrations`);
        let registrations = await userReq.json();

        if (req.ok) {
            let data = await req.json();
            if (data.length > 0) {
                $courses = data;
                $courses.map((course) => {
                    let reg = registrations.find((el) => {
                        return el.course.id === course.id;
                    });

                    if (reg && reg.attended) {
                        course['state'] = 'attended';
                    } else if (reg) {
                        course['state'] = 'registered';
                    } else {
                        course['state'] = 'available';
                    }

                    return course;
                });
                console.log($courses);
            }
        }
        return $courses;
    };
</script>

<section class="main-container">
    {#await $courses then courses}
        {#each courses as course}
            <Course {...course} />
        {/each}
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
    :global(.course-detail) {
        position: fixed;
        right: 0;
        top: 0;
        width: 350px;
        padding: 12px;
        border-radius: 5px 0 0 5px;
        height: 100%;
        box-shadow: var(--left-shadow);
        background-color: var(--text-white);
        box-sizing: border-box;
    }
</style>

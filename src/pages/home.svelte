<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import Course from '../components/Course.svelte';
    import CourseDetails from '../components/CourseDetails.svelte';
    import { courses, courseDetail, courseDetailInitial } from '../store.js';

    const d = createEventDispatcher();

    let sidebarVisible = false;

    onMount(() => {
        $courseDetail = {};
        getCourses();
    });

    const getUser = async () => {
        let req = await fetch('/getsession');
        let data = await req.json();

        return data;
    };

    // TODO: Make this reactive.
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
            <Course
                {...course}
                on:showSidebar={() => {
                    sidebarVisible = !sidebarVisible;
                }}
            />
        {/each}
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
    :global(.course-detail) {
        position: fixed;
        overflow-y: scroll;
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

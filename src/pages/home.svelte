<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import Course from '../components/Course.svelte';
    import CourseDetails from '../components/CourseDetails.svelte';
    import {
        courses,
        courseDetail,
        courseDetailInitial,
        registrations,
        user,
    } from '../store.js';
    import { handleErrors } from '../utils.js';

    const d = createEventDispatcher();

    let sidebarVisible = false;

    onMount(() => {
        $courseDetail = courseDetailInitial;
        getCourses();
    });

    const getCourses = async () => {
        const urls = [`/courses`, `/users/${$user.id}/registrations`];
        let data = await Promise.all(
            urls.map(async (url) => {
                const resp = handleErrors(await fetch(url));
                return await resp.json();
            }),
        );

        $courses = data[0];
        $registrations = data[1];

        // Add a state icon to each course;
        $courses.map((course) => {
            let reg = $registrations.find((el) => {
                return el.course.id === course.id;
            });
            try {
                if (reg && reg.attended) {
                    course['state'] = 'attended';
                } else if (reg) {
                    course['state'] = 'registered';
                } else {
                    course['state'] = 'available';
                }
                return course;
            } catch (e) {
                d('handleToast', e);
            }
        });

        $registrations.map((course) => {
            if (course.attended) {
                course.course['state'] = 'attended';
            } else {
                course.course['state'] = 'registered';
            }
        });
    };
</script>

<section
    on:keydown={(e) => {
        if (e.key === 'Escape') {
            sidebarVisible = false;
        }
    }}
    class="main-container"
>
    <!-- {#await $courses then courses} -->
    {#if $courses.length === 0}
        <p>Loading...</p>
    {:else}
        {#each $courses as course (course.id)}
            <Course
                {course}
                on:showSidebar={() => {
                    sidebarVisible = !sidebarVisible;
                }}
            />
        {/each}
    {/if}
    <!-- {/await} -->
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
            on:handleToast
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

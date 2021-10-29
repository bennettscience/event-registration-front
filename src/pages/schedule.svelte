<script>
    // TODO: This mirrors the home page pretty closely. How can it be changed to be more unique or helpful?
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import {
        courseDetail,
        courseDetailInitial,
        registrations,
    } from '../store.js';
    import Course from '../components/Course.svelte';
    import CourseDetails from '../components/CourseDetails.svelte';

    let sidebarVisible = false;

    onMount(() => {
        $courseDetail = courseDetailInitial;
    });
</script>

<section class="main-container">
    {#each $registrations as reg (reg.course.id)}
        <Course
            course={reg.course}
            on:showSidebar={() => {
                sidebarVisible = !sidebarVisible;
            }}
        />
    {/each}
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
</style>

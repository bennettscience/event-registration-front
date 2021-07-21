<script>
    import { createEventDispatcher } from 'svelte';
    import Calendar from './Calendar.svelte';
    import UserCourseState from './UserCourseState.svelte';
    import { courseDetail } from '../store.js';

    const d = createEventDispatcher();

    export let title;
    export let description;
    export let starts;
    export let ends;
    export let state;
    export let location;
    export let available;
    export let presenters;
    export let links;
    export let id;

    // Do some magic on the starts/ends props
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(starts);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(starts);

    function handleClick() {
        courseDetail.set({
            id: id,
            title: title,
            description: description,
            starts: starts,
            ends: ends,
            location: location,
            available: available,
            state: state,
            presenters: presenters,
            links: links,
        });
        d('showPanel', true);
    }
</script>

<article {id} class="course" on:click={handleClick}>
    <div class="course-calendar">
        <Calendar>
            <span slot="month">{mo}</span>
            <span slot="date">{day}</span>
        </Calendar>
    </div>
    <div class="course-details">
        <h1>
            {title}
        </h1>
        {#if state !== 'available'}
            <UserCourseState {state} />
        {/if}
        <p>
            {description}
        </p>
    </div>
</article>

<style>
    .course {
        box-shadow: var(--box-shadow);
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 20px;
        transition: all 0.125s ease-in-out;
    }
    .course:hover {
        box-shadow: var(--active-shadow);
        cursor: pointer;
    }
    .course-details {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        padding: 0 15px 0 0;
    }
    p {
        display: block;
        min-width: 100%;
    }
</style>

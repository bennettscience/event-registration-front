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
        d('showSidebar');
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
        <span>
            {#if state !== 'available'}
                <UserCourseState {state} />
            {/if}
        </span>
        <p>
            {@html description}
        </p>
    </div>
</article>

<style>
    .course {
        display: grid;
        gap: 12px;
        grid-template-areas: 'calendar details';
        grid-template-columns: auto 1fr;
        box-sizing: border-box;
        border-radius: 5px;
        margin-bottom: 20px;
        box-shadow: var(--box-shadow);
        transition: all 0.125s ease-in-out;
    }
    .course-calendar {
        grid-area: calendar;
    }
    .course:hover {
        box-shadow: var(--active-shadow);
        cursor: pointer;
    }
    .course-details {
        display: flex;
        flex-direction: row;
        grid-area: details;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        padding: 0 15px 0 0;
    }
    p {
        display: block;
        box-sizing: border-box;
        min-width: 100%;
        text-align: justify;
        padding-right: 20px;
    }

    @media only screen and (max-width: 767px) {
        .course {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .course-calendar {
            width: 100%;
        }

        .course-details {
            padding: 5px;
            display: grid;
            grid-template-areas: 'title' 'description' 'status';
        }

        .course-details h1 {
            grid-area: title;
            font-size: 24px;
        }

        .course-details span {
            grid-area: status;
        }

        .course-details p {
            grid-area: description;
        }
    }
</style>

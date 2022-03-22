<script>
    import { beforeUpdate, createEventDispatcher, onDestroy } from 'svelte';
    import { clock, pin, user } from '../assets/icons.js';
    import {
        courseDetail,
        courseDetailInitial,
        courses,
        registrations,
    } from '../store.js';
    import RegisterForm from './buttons/RegisterForm.svelte';
    import CancelButton from './buttons/CancelButton.svelte';
    import { formatDate } from '../utils.js';

    const d = createEventDispatcher();

    let disabled;
    let startDateTime;
    let endTime;

    function handleRegister(event) {
        let change = event.detail;

        // Find the course in the store
        let index = $courses.findIndex((el) => {
            return el.id === change.courseId;
        });

        // Update the course state in the store. This updates the Home view so courses registered
        // will show the correct badge.

        // TODO: This could probably be moved into some kind of state machine.
        $courses[index].state = 'registered';

        // Reassign the objects to register the changes.
        $courses = $courses;
        $courseDetail.state = 'registered';
        $courseDetail = { ...$courseDetail };

        // Append an object to the registrations store until they're queried again via the API.
        $registrations = [
            ...$registrations,
            {
                attended: false,
                course: { ...$courses[index] },
            },
        ];

        d('handleToast', {
            toastBody: `Successfully registered for ${$courseDetail.title}.`,
            isError: false,
        });

        d('hideSidebar');
    }

    function handleCancel(event) {
        let change = event.detail;
        let index = $courses.findIndex((el) => {
            return el.id === change.courseId;
        });

        let updated = $registrations.filter(
            (reg) => reg.course.id !== change.courseId,
        );

        $registrations = updated;

        $courses[index].state = 'available';
        $courseDetail.state = 'available';

        $courses = $courses;

        d('handleToast', {
            toastBody: `Successfully cancelled ${$courseDetail.title}.`,
            isError: false,
        });
        d('hideSidebar');
    }

    beforeUpdate(() => {
        if ($courseDetail?.state !== 'available') {
            disabled = true;
        } else {
            disabled = false;
        }
    });

    onDestroy(() => ($courseDetail = courseDetailInitial));

    console.log($courseDetail);

    $: startDateTime = formatDate('starts', $courseDetail.starts);
    $: endTime = formatDate('ends', $courseDetail.ends);
    $: links = links;
</script>

<h1>
    {$courseDetail.title}
</h1>
<hr />

{#if $courseDetail.available > 0}
    {#if $courseDetail.state === 'registered' && $courseDetail.state !== 'attended'}
        <CancelButton id={$courseDetail.id} on:cancel={handleCancel} />
    {:else if $courseDetail.state === 'available' && $courseDetail.state !== 'attended'}
        <!-- The register button makes the actual API call to the backend. This event updates the
             ui depeding on the results of that call. Same case for cancelling course registrations. -->
        <RegisterForm
            {disabled}
            id={$courseDetail?.id}
            on:register={handleRegister}
        />
    {/if}
{:else if $courseDetail.available === 0 && $courseDetail.state === 'registered'}
    <CancelButton id={$courseDetail.id} on:cancel={handleCancel} />
{:else}
    <RegisterForm disabled="true" id={$courseDetail?.id} />
{/if}
<hr />
<time>
    <svg
        fill="none"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg">{@html clock}</svg
    >
    {startDateTime} - {endTime}
</time>
<!-- TODO: This is undefined in the schedule view -->
<span id="course-size">
    <svg
        fill="none"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg">{@html user}</svg
    >
    {$courseDetail.available}
</span>
<span>
    <svg
        fill="none"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg">{@html pin}</svg
    >
    {$courseDetail.location?.name}, {$courseDetail?.location?.address}
</span>

<div>
    <h2>Presenters</h2>
    <ul>
        {#each $courseDetail?.presenters as presenter}
            <li><a href="mailto:{presenter.email}">{presenter.name}</a></li>
        {/each}
    </ul>
</div>

{#if $courseDetail.state !== 'available' && $courseDetail?.links.length > 0}
    <div>
        <h2>Links</h2>
        <ul>
            {#each $courseDetail?.links as link}
                <li><a href={link.uri}>{link.name}</a></li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    time,
    span {
        display: flex;
        align-items: center;
        margin: 15px 0;
    }
    h1 {
        font-family: 'Oswald', Helvetica, Arial, sans-serif;
        font-size: 32px;
        margin: 0;
        text-align: center;
    }
    hr {
        width: 70%;
    }
    svg {
        margin-right: 12px;
    }
</style>

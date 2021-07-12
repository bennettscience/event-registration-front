<script>
    import { beforeUpdate } from 'svelte';
    import { clock, pin, users } from '../assets/icons.js';
    import { courseDetail, courses } from '../store.js';
    import RegisterButton from './buttons/RegisterButton.svelte';
    import CancelButton from './buttons/CancelButton.svelte';
    import { formatDate } from '../utils.js';

    let disabled;
    let index;
    let startDateTime;
    let endTime;

    function handleRegister(event) {
        let change = event.detail;
        console.log(change.courseId);
        index = $courses.findIndex((el) => {
            console.log(el.id === change.courseId);
            return el.id === change.courseId;
        });
        $courses[index].state = 'registered';
        $courseDetail.state = 'registered';
    }

    function handleCancel(event) {
        let change = event.detail;
        console.log(change);
        index = $courses.findIndex((el) => {
            return el.id === change.courseId;
        });
        console.log(index);
        $courses[index].state = 'available';
        $courseDetail.state = 'available';
    }

    beforeUpdate(() => {
        if ($courseDetail?.state !== 'available') {
            disabled = true;
        } else {
            disabled = false;
        }
    });

    $: startDateTime = formatDate('starts', $courseDetail.starts);
    $: endTime = formatDate('ends', $courseDetail.ends);
</script>

<h1>
    {$courseDetail.title}
</h1>
<p>
    {$courseDetail?.description}
</p>
{#if $courseDetail.state === 'registered' && $courseDetail.state !== 'attended'}
    <CancelButton id={$courseDetail.id} on:cancel={handleCancel} />
{:else if $courseDetail.state === 'available' && $courseDetail.state !== 'attended'}
    <RegisterButton
        {disabled}
        id={$courseDetail?.id}
        on:register={handleRegister}
    />
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
<span>
    <svg
        fill="none"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg">{@html users}</svg
    >
    {$courseDetail?.available}
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

{#if $courseDetail?.links.length > 0}
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
        font-family: 'Oswald', sans-serif;
        font-size: 32px;
        margin: 0;
    }
    p {
        font-family: 'Roboto', sans-serif;
    }
    hr {
        width: 70%;
    }
    svg {
        margin-right: 12px;
    }
</style>

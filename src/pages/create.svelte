<script>
    import { fly } from 'svelte/transition';
    import { user } from '../store';
    import { handleErrors } from '../utils';
    import FormWrapper from '../components/FormWrapper.svelte';
    import Modal from '../components/ModalView.svelte';
    import { locationFields } from '../assets/createLocationFields';
    import { eventFields } from '../assets/createEventFields';
    import { presenter } from '../assets/icons';
    import TextArea from '../components/formFields/TextArea.svelte';

    // Form fields
    let fields; // generic variable to assign fields dynamically
    let courseTypes = [];
    let locations = [];
    let response;
    let users;

    // Bind the form itself to reset values on submit
    let formEl;

    const modalInitial = {
        heading: '',
        content: '',
        response: '',
    };

    // Modal control to confirm event submission
    let isModalOpen = false;
    let loading = false;
    let modalText = {
        heading: 'Submitting',
        content: 'Submiting the event...',
        response: '',
    };

    let sidebarVisible = false;
    let course = {};
    let onSubmit;
    let result = '';

    // Keep the details fieldset disabled until there is text in the basics
    // let disabled = true;

    const handleNewEventType = () => {
        sidebarVisible = true;
        fields = eventFields;
        onSubmit = async (data) => {
            let req = await fetch('/courses/types', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (req.ok) {
                let resp = await req.json();
                courseTypes.push({ name: resp.name, id: resp.id });
                courseTypes = courseTypes;
                result = `Success!`;
                setTimeout(
                    () => ((sidebarVisible = false), (result = '')),
                    2000,
                );
            } else {
                result = req;
            }
        };
    };

    const handleNewLocation = () => {
        sidebarVisible = true;
        fields = locationFields;
        onSubmit = async (data) => {
            let req = await fetch('/locations', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (req.ok) {
                let resp = await req.json();
                locations.push({ name: resp.name, id: resp.id });
                locations = locations;
                result = `Success!`;
                setTimeout(
                    () => ((sidebarVisible = false), (result = '')),
                    2000,
                );
            }
        };
    };

    const getFormFieldData = async () => {
        // This is messy and could be cleaned up. When the component mounts, get
        // location and event type data immedaitely and do two things:
        // 1. Assign data to the parent prop so we can update it later (maybe)
        // 2. Return an object for the form to populate select fields.
        const urls = ['/locations', '/courses/types', '/users'];

        // Change to Promise.all and map
        await Promise.all(
            urls.map(async (url) => {
                const resp = await fetch(url);
                return await resp.json();
            }),
        ).then((result) => {
            locations = result[0];
            courseTypes = result[1];
        });

        return response;
    };

    // When submitting, turn our fields representation into a JSON body and pass back to the parent for handling.
    const handleSubmit = async () => {
        isModalOpen = true;
        loading = true;
        // TODO: Add some validation here
        await createCourse(course).then((course = {}));
    };

    // TODO: Clear the form after submit.
    async function createCourse(course) {
        // Python has timestamps in seconds, JS is in millisecons. Convert
        // on the client before submitting.
        course.starts = new Date(course.starts).getTime() / 1000;
        course.ends = new Date(course.ends).getTime() / 1000;

        let req = handleErrors(
            await fetch(`/courses`, {
                method: 'POST',
                body: JSON.stringify(course),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );
        if (req.ok) {
            let response = await req.json();
            modalText.heading = 'Success!';
            modalText.content = `Successfully created ${response.title}.`;

            loading = false;
            setTimeout(() => {
                isModalOpen = false;
                modalText = modalInitial;
                fields = getFormFieldData();
            }, 2000);
        } else {
            result = req;
        }
    }
</script>

<section class="main-container">
    {#if $user.role.id === 1 || $user.role.id === 2}
        <h1>New Event</h1>
        <p>
            This form will create and publish a new event. You can edit the
            event later in the <b>Presenter dashboard</b> if you need to make a change.
        </p>
        {#await getFormFieldData() then fields}
            <form
                on:submit|preventDefault={() => handleSubmit(fields)}
                bind:this={formEl}
            >
                <fieldset class="basics">
                    <legend><h1>Basics</h1></legend>
                    <label
                        ><b>Event title</b>
                        <input
                            autocomplete="off"
                            name="title"
                            bind:value={course.title}
                            placeholder="title"
                            required="true"
                            tabindex="0"
                        /></label
                    >
                    <TextArea
                        label="Description"
                        name="description"
                        bind:value={course.description}
                        placeholder="Event description"
                        required="true"
                    />
                </fieldset>
                <fieldset class="details">
                    <legend><h1>Event Details</h1></legend>
                    <!-- <label id="presenter"
                        ><b>Lead Facilitator</b>
                        <select bind:value={course.presenter} name="presenters">
                            {#each fields.users as user}
                                <option value={user.id}>{user.name}</option>
                            {/each}
                        </select>
                    </label> -->
                    <label id="type"
                        ><b>Event type</b>
                        <select
                            tabindex="0"
                            bind:value={course.coursetype_id}
                            name="coursetype_id"
                        >
                            {#each courseTypes as type}
                                <option value={type.id}>{type.name}</option>
                            {/each}
                        </select>
                        <span
                            tabindex="0"
                            class="new-action-btn"
                            on:click={handleNewEventType}
                            >Add new event type</span
                        >
                    </label>

                    <label id="location"
                        ><b>Event Location</b>
                        <select
                            tabindex="0"
                            bind:value={course.location_id}
                            name="location_id"
                        >
                            {#each locations as location}
                                <option value={location.id}
                                    >{location.name}</option
                                >
                            {/each}
                        </select>
                        <span
                            tabindex="0"
                            class="new-action-btn"
                            on:click={handleNewLocation}>Add new location</span
                        >
                    </label>
                    <label id="starts"
                        ><b>Starts</b>
                        <input
                            tabindex="0"
                            name="starts"
                            type="datetime-local"
                            bind:value={course.starts}
                            required="true"
                        /></label
                    >
                    <label id="ends"
                        ><b>Ends</b>
                        <input
                            tabindex="0"
                            name="ends"
                            type="datetime-local"
                            bind:value={course.ends}
                            required="true"
                        /></label
                    >
                    <label
                        ><b>Attendance limit</b>
                        <input
                            tabindex="0"
                            name="course_size"
                            bind:value={course.course_size}
                            type="number"
                            required="true"
                        /></label
                    >
                </fieldset>
                <button tabindex="0" type="submit">Submit</button>
            </form>
        {/await}
    {:else}
        <p>
            Sorry, you don't have the right permissions to access this page. If
            you think this is incorrect,
            <a href="mailto:pd@elkhart.k12.in.us">let us know.</a>
        </p>
        <p><a href="/">Back home</a></p>
    {/if}
</section>
{#if isModalOpen}
    <Modal {modalText} confirmRequired={false} bind:isModalOpen bind:loading />
{/if}
{#if sidebarVisible}
    <section transition:fly={{ x: 200, duration: 500 }} class="course-detail">
        <p id="close" on:click={() => (sidebarVisible = false)}>
            <span>&times</span>Cancel
        </p>
        <svelte:component this={FormWrapper} {fields} {onSubmit} />
        {#if result}
            <span id="result">{result}</span>
        {/if}
    </section>
{/if}

<style>
    .main-container {
        padding-right: 0;
    }
    :global(form) {
        display: block;
        position: relative;
    }
    form {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }
    fieldset {
        margin: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-content: center;
        margin-bottom: 20px;

        /* Fieldset styles */
        border: 0;
        padding-left: 200px;
        position: relative;
    }
    legend {
        position: absolute;
        left: 0;
    }
    :global(label) {
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
    }
    :global(textarea) {
        resize: none;
    }
    :global(input, textarea) {
        box-sizing: border-box;
        line-height: 1.2;
        border: 1px solid transparent;
        border-radius: 0;
        border-bottom: 3px solid var(--site-gray);
        transition: all 0.25s ease-in-out;
    }
    :global(input:focus, textarea:focus) {
        outline: 0;
        border: 1px solid var(--accent-blue);
        border-bottom: 3px solid var(--accent-blue);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    :global(input, select, textarea) {
        display: block;
        margin: 5px 0;
        width: 100%;
    }
    input[name='title'] {
        width: 100%;
    }
    .details #type,
    #location {
        width: 30%;
        flex: 1 0 auto;
        margin-bottom: 25px;
    }
    .new-action-btn {
        color: var(--accent-blue);
    }
    .new-action-btn:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    #starts,
    #ends {
        width: 50%;
    }
    select {
        width: 100%;
    }
    button[type='submit'] {
        position: relative;
        right: 0;
        padding: 15px 40px;
        border: 3px solid var(--accent-blue);
        background-color: var(--accent-blue);
        border-radius: 5px;
        transition: all 0.25s ease-in-out;
        font-weight: bold;
        color: var(--text-white);
    }
    button[type='submit']:hover {
        cursor: pointer;
        background-color: var(--text-white);
        color: var(--accent-blue);
    }
    button[type='submit']:focus {
        border-color: var(--site-dark);
    }
    :global(#close) {
        vertical-align: middle;
    }
    :global(#close span) {
        font-size: 24px;
        padding: 5px;
    }
    :global(#close:hover) {
        cursor: pointer;
    }
    #result {
        position: relative;
        display: block;
    }
</style>

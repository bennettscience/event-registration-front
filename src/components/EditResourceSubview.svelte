<script>
    import { user } from '../store';
    import { createEventDispatcher } from 'svelte';
    import { convertToPythonTimestamp, handleErrors } from '../utils.js';
    import { circleCheck } from '../assets/icons';
    import Form from './FormWrapper.svelte';
    import UserEventDetail from '../components/UserEventDetail.svelte';

    // Props
    export let resourceId;
    export let dataTarget;

    const d = createEventDispatcher();

    // Instantiate some common data stores
    let links = [];
    let presenters = [];
    let fields = [];
    let result = null;
    let allowed = [];
    let data = {};

    // Determine the endpoint and method for each update operation.
    const targets = {
        course: {
            uri: `/courses/${resourceId}`,
            method: 'PUT',
        },
        duplicate: {
            uri: `/courses`,
            method: 'POST',
        },
        links: {
            uri: `/courses/${resourceId}/links`,
            method: 'POST',
        },
        presenters: {
            uri: `/courses/${resourceId}/presenters`,
            method: 'POST',
        },
        user: {
            uri: `users/${resourceId}`,
            method: 'PUT',
        },
    };

    const deleteLink = async (linkId) => {
        let request = handleErrors(
            await fetch(`/courses/${resourceId}/links/${linkId}`, {
                method: 'DELETE',
            }),
        );
        let response = await request.json();
        links = response.links;

        d('handleToast', {
            toastBody: response.message,
            isError: false,
        });
    };

    // Course changes
    // Event types and locations are dynamic, so they need to be loaded when the component is mounted.
    const editCourse = async () => {
        // Editing a course requires three endpoints:
        //  - the course
        //  - event types
        //  - locations
        // Fetch them all now and get the fields prepped for the form.
        // Returns an object as {course: {}, types: [{}...], locations: [{}...]}
        const urls = [`/courses/${resourceId}`, `/courses/types`, `/locations`];
        await Promise.all(
            urls.map(async (url) => {
                const resp = await fetch(url);
                return await resp.json();
            }),
        ).then(
            ([course, types, locations]) =>
                (data = {
                    course,
                    types,
                    locations,
                }),
        );

        // The object that comes back from the API is bigger than we need for presenters. Filter
        // the object down to the approved keys and build out a form fields array.
        // Because `data` is an array of objects, Object.keys() is needed to check the keys within
        // each object instead of filtering directly.

        const allowed = ['id', 'name']; // the only keys we want from types and locations
        Object.keys(data.course)
            .filter((item) => {
                let courseAllowed = [
                    'title',
                    'description',
                    'location',
                    'type',
                    'location',
                    'course_size',
                    'starts',
                    'ends',
                ];
                if (courseAllowed.includes(item)) {
                    return true;
                } else {
                    return false;
                }
            })
            .map(async (key) => {
                // Map each key into a field object for the form
                let field;
                if (key === 'title') {
                    field = {
                        name: 'title',
                        type: 'Input',
                        value: data.course[key],
                        placeholder: 'Enter title...',
                        label: 'Event Title',
                    };
                } else if (key === 'description') {
                    field = {
                        name: 'description',
                        type: 'TextArea',
                        value: data.course[key],
                        placeholder: '',
                        label: 'Event description',
                    };
                } else if (key === 'starts' || key === 'ends') {
                    field = {
                        name: key,
                        label: key,
                        id: key,
                        type: 'DateTime',
                        value: new Date(data.course[key]).toISOString(),
                        datetime: new Date(data.course[key]).toISOString(),
                    };
                } else if (key === 'course_size') {
                    field = {
                        name: 'course_size',
                        id: 'course-size',
                        type: 'Number',
                        value: data.course[key],
                        placeholder: data[key],
                        label: 'Attendance limit',
                    };
                } else if (key === 'type') {
                    let types = data.types.map((item) =>
                        allowed.reduce((idx, current) => {
                            idx[current] = item[current];
                            return { value: item.id, label: item.name };
                        }, {}),
                    );
                    field = {
                        name: 'coursetype_id',
                        id: 'course-type',
                        type: 'Select',
                        value: data.course[key].id,
                        label: 'Event type',
                        options: types,
                    };
                } else if (key === 'location') {
                    let locations = data.locations.map((item) =>
                        allowed.reduce((idx, current) => {
                            idx[current] = item[current];
                            return { value: item.id, label: item.name };
                        }, {}),
                    );
                    field = {
                        name: 'location_id',
                        id: 'location',
                        type: 'Select',
                        value: data.course[key].id,
                        label: 'Location',
                        options: locations,
                    };
                }
                fields.push(field);
                fields = fields.sort((a, b) => {
                    return allowed.indexOf(a.name) - allowed.indexOf(b.name);
                });
            });
        fields = fields;
    };

    const editPresenters = async () => {
        // TODO: Remove presenter from event
        // New User component with state actions
        let users;
        let urls = [`/courses/${resourceId}/presenters`];
        if ($user.role.id === 1) {
            urls = [...urls, `/users`];
        } else if ($user.role.id === 2) {
            urls = [...urls, `/users?user_type=2`];
        }

        await Promise.all(
            urls.map(async (url) => {
                const resp = await fetch(url);
                return await resp.json();
            }),
        ).then(
            ([presenters, users]) =>
                (data = {
                    presenters,
                    users,
                }),
        );

        presenters = data.presenters;

        const allowed = ['id', 'name'];
        users = data.users
            .filter(
                (user) =>
                    !data.presenters.find(
                        (presenter) => presenter.id === user.id,
                    ),
            )
            .map((item) =>
                allowed.reduce((idx, current) => {
                    idx[current] = item[current];
                    return { value: item.id, label: item.name };
                }, {}),
            );
        fields = [
            {
                type: 'Select',
                label: 'Add as a presenter',
                name: 'userId',
                value: 1,
                options: users,
            },
        ];
    };

    const editLinks = async () => {
        let linktypes;
        const urls = [`/courses/${resourceId}/links`, `/courselinktypes`];

        await Promise.all(
            urls.map(async (url) => {
                const resp = await fetch(url);
                return await resp.json();
            }),
        ).then(
            ([links, linkTypes]) =>
                (data = {
                    links,
                    linkTypes,
                }),
        );

        let allowed = ['id', 'name'];
        links = data.links;
        console.log(links);

        linktypes = data.linkTypes.map((item) =>
            allowed.reduce((idx, current) => {
                idx[current] = item[current];
                return { value: item.id, label: item.name };
            }, {}),
        );

        // Add a form to create a new link for the event.
        fields = [
            {
                type: 'Select',
                name: 'courselinktype_id',
                value: 1,
                label: '',
                options: linktypes,
            },
            {
                type: 'Input',
                name: 'name',
                value: '',
                label: '',
                placeholder: 'Enter link text',
            },
            {
                type: 'Link',
                name: 'uri',
                value: '',
                label: '',
                placeholder: 'https://example.com',
            },
        ];
        fields = fields;
    };

    const editUser = async () => {
        const urls = [
            `/users/${resourceId}`,
            `/users/${resourceId}/registrations`,
            `/courses?all=true`,
        ];

        await Promise.all(
            urls.map(async (url) => {
                const resp = await fetch(url);
                return await resp.json();
            }),
        ).then(
            ([user, registrations, events]) =>
                (data = {
                    user,
                    registrations,
                    events,
                }),
        );
        fields = [
            {
                type: 'Input',
                name: 'name',
                value: data.user.name,
                label: 'Edit Name',
                placeholder: '',
            },
            {
                type: 'Input',
                name: 'email',
                value: data.user.email,
                label: 'Edit email',
                placeholder: '',
            },
        ];
        fields = fields;
    };

    const duplicateEvent = async () => {
        // Get the requested course and store data in hidden fields
        // Only show the start/end fields and title
        let request = handleErrors(await fetch(`/courses/${resourceId}`));
        data = await request.json();

        fields = [
            {
                type: 'Input',
                name: 'title',
                value: data.title,
                label: 'Title',
                placeholder: '',
            },
            {
                type: 'DateTime',
                name: 'starts',
                value: data.starts,
                label: 'Start',
            },
            {
                type: 'DateTime',
                name: 'ends',
                value: data.ends,
                label: 'End',
            },
            {
                type: 'Hidden',
                value: data.description,
                name: 'description',
            },
            {
                type: 'Hidden',
                value: data.type.id,
                name: 'coursetype_id',
            },
            {
                type: 'Hidden',
                value: data.location.id,
                name: 'location_id',
            },
            {
                type: 'Hidden',
                value: data.course_size,
                name: 'course_size',
            },
        ];
        fields = fields;
    };

    // Prefill form fields with existing values
    // TODO: could this be cleaner?
    if (dataTarget === 'course') {
        editCourse();
    } else if (dataTarget === 'presenters') {
        editPresenters();
    } else if (dataTarget === 'links') {
        editLinks();
    } else if (dataTarget === 'user') {
        editUser();
    } else if (dataTarget === 'duplicate') {
        duplicateEvent();
    } else {
        d('handleToast', {
            isError: true,
            toastBody: 'Action not allowed.',
        });
    }

    const handleSubmit = async (data) => {
        let endpoint = targets[dataTarget].uri;
        let method = targets[dataTarget].method;

        if (dataTarget === 'course' || dataTarget === 'duplicate') {
            data.starts = convertToPythonTimestamp(data.starts);
            data.ends = convertToPythonTimestamp(data.ends);
        }

        if (dataTarget === 'presenters') {
            data = { user_ids: [data.userId] };
        }

        try {
            let req = await fetch(endpoint, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let response = await req.json();

            d('handleToast', {
                isError: false,
                toastBody: response.message,
            });
            setTimeout(() => d('success'), 2000);
        } catch (e) {
            d('handleToast', {
                isError: true,
                toastBody: e,
            });
        }
    };
</script>

<ul>
    {#if links.length > 0 && !Object.entries($user).length === 0}
        {#each links as link}
            <li>
                <a href={link.uri}>{link.name}</a> -
            </li>
        {/each}
    {/if}
    {#if presenters.length > 0}
        {#each presenters as presenter}
            <li><a href="mailto:{presenter.email}">{presenter.name}</a></li>
        {/each}
    {/if}
</ul>

{#await fields then fields}
    {#if dataTarget === 'duplicate'}
        <b>Duplicate Event</b>
        <p>
            Enter a new title, start time, and end time for the event. Other
            event details will be copied automatically.
        </p>
    {/if}
    <Form {fields} onSubmit={(body) => handleSubmit(body)} />
{/await}

{#if dataTarget === 'links'}
    <ul id="links-list">
        {#if links.length > 0}
            {#each links as link}
                <li>
                    <button on:click={deleteLink(link.id)}>×</button>
                    <a href={link.uri}>{link.name}</a>
                </li>
            {/each}
        {/if}
    </ul>
{/if}

{#if data?.registrations}
    <UserEventDetail
        events={data.events}
        registrations={data.registrations}
        userId={resourceId}
    />
{/if}
{#if result}
    <span id="result">{result}</span>
{/if}

<style>
    #result {
        position: relative;
    }
    #links-list {
        list-style-type: none;
        padding-left: 0;
    }
    #links-list > li {
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: center;
    }
    #links-list > li > button {
        background-color: var(--accent-red);
        border: none;
        color: var(--text-white);
        font-weight: bold;
        /* font-size: 12px; */
        margin-right: 25px;
        margin-bottom: 0;
    }
    #links-list > li > button:hover {
        cursor: pointer;
    }
</style>

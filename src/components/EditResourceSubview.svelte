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
        presenters: {
            uri: `/courses/${resourceId}/presenters`,
            method: 'POST',
        },
        links: {
            uri: `/courses/${resourceId}/links`,
            method: 'POST',
        },
        user: {
            uri: `users/${resourceId}`,
            method: 'PUT',
        },
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
                        id: key,
                        type: 'DateTime',
                        value: data.course[key],
                        datetime: data.course[key],
                    };
                    if (key === 'starts') {
                        field.shift = false;
                        field.label = 'Starts';
                    } else {
                        field.shift = false;
                        field.label = 'Ends';
                    }
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
            `/courses`,
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
    } else {
        console.log(`That's not allowed.`);
    }

    const handleSubmit = async (data) => {
        let endpoint = targets[dataTarget].uri;
        let method = targets[dataTarget].method;
        result = 'Submitting change...';

        if (dataTarget === 'course') {
            data.starts = convertToPythonTimestamp(data.starts);
            data.ends = convertToPythonTimestamp(data.ends);
        }

        if (dataTarget === 'presenters') {
            data = { user_ids: [data.userId] };
        }

        let req = handleErrors(
            await fetch(endpoint, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );

        if (req.ok) {
            // let response = await req.json();
            result = `Success!`;
            setTimeout(() => d('success'), 2000);
        }
    };
</script>

<ul>
    {#if links.length > 0}
        {#each links as link}
            <li><a href={link.uri}>{link.name}</a></li>
        {/each}
    {/if}
    {#if presenters.length > 0}
        {#each presenters as presenter}
            <li><a href="mailto:{presenter.email}">{presenter.name}</a></li>
        {/each}
    {/if}
</ul>

{#await fields then fields}
    <Form {fields} onSubmit={(body) => handleSubmit(body)} />
{/await}
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
</style>

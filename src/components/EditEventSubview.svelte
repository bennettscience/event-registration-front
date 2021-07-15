<script>
    import { createEventDispatcher } from 'svelte';
    import {
        convertToPythonTimestamp,
        handleErrors,
        Requester,
    } from '../utils.js';
    import Form from './FormWrapper.svelte';
    import ModalView from '../components/ModalView.svelte';

    // Props
    export let courseId;
    export let dataTarget;

    // Instantiate some common data stores
    let requester = new Requester('/');
    let links = [];
    let presenters = [];
    let fields = [];
    let result = null;
    let allowed = [];
    let userId;
    let request;

    const d = createEventDispatcher();

    const targets = {
        course: {
            uri: `/courses/${courseId}`,
            method: 'PUT',
        },
        presenters: {
            uri: `/courses/${courseId}/presenters`,
            method: 'POST',
        },
        links: {
            uri: `/courses/${courseId}/links`,
            method: 'POST',
        },
    };

    // function reduceFields(data) {
    //     data.reduce((el, item) => ({ ...el, [item.name]: item.value }), {});
    // }

    // Course changes
    const getEventTypes = async () => {
        let resp = await requester.request('get', 'courses/types', '', null, {
            'Content-Type': 'application/json',
        });
        // let resp = await fetch('/courses/types');
        // if (resp.ok) {
        //     data = resp.json();
        // }
        console.log(resp);
        return resp;
    };

    const getLocations = async () => {
        let resp = await requester.request('/locations');
        // let resp = await fetch('/locations');
        return resp;
    };

    const editCourse = async () => {
        let req = await fetch(`/courses/${courseId}`);
        let data = await req.json();

        // The object that comes back from the API is bigger than we need for presenters. Filter
        // the object down to the approved keys and build out a form fields array.
        Object.keys(data)
            .filter((item) => {
                allowed = [
                    'title',
                    'description',
                    'location',
                    'type',
                    'location',
                    'course_size',
                    'starts',
                    'ends',
                ];
                if (allowed.includes(item)) {
                    return true;
                } else {
                    return false;
                }
            })
            .map(async (key) => {
                let field;
                if (key === 'title') {
                    field = {
                        name: 'title',
                        type: 'Input',
                        value: data[key],
                        placeholder: 'Enter title...',
                        label: 'Event Title',
                    };
                } else if (key === 'description') {
                    field = {
                        name: 'description',
                        type: 'TextArea',
                        value: data[key],
                        placeholder: '',
                        label: 'Event description',
                    };
                } else if (key === 'starts' || key === 'ends') {
                    field = {
                        name: key,
                        id: key,
                        type: 'DateTime',
                        value: data[key],
                        datetime: new Date().toISOString(),
                    };
                    if (key === 'starts') {
                        field.shift = false;
                        field.label = 'Starts';
                    } else {
                        field.shift = true;
                        field.label = 'Ends';
                    }
                } else if (key === 'course_size') {
                    field = {
                        name: 'course_size',
                        id: 'course-size',
                        type: 'Number',
                        value: data[key],
                        placeholder: data[key],
                        label: 'Attendance limit',
                    };
                } else if (key === 'type') {
                    let type = await getEventTypes();
                    const allowed = ['id', 'name'];
                    let types = type.map((item) =>
                        allowed.reduce((idx, current) => {
                            idx[current] = item[current];
                            return { value: item.id, label: item.name };
                        }, {}),
                    );
                    console.log(types);
                    field = {
                        name: 'coursetype_id',
                        id: 'course-type',
                        type: 'Select',
                        value: data[key].id,
                        label: 'Event type',
                        options: types,
                    };
                } else if (key === 'location') {
                    let location = await getLocations();
                    const allowed = ['id', 'name'];
                    let locations = location.map((item) =>
                        allowed.reduce((idx, current) => {
                            idx[current] = item[current];
                            return { value: item.id, label: item.name };
                        }, {}),
                    );
                    field = {
                        name: 'location_id',
                        id: 'location',
                        type: 'Select',
                        value: data[key].id,
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
        let users;
        let req = handleErrors(await fetch(`/courses/${courseId}/presenters`));
        presenters = await req.json();

        let reqUsers = handleErrors(await fetch(`/users`));
        users = await reqUsers.json();

        const allowed = ['id', 'name'];
        users = users
            .filter(
                (user) =>
                    !presenters.find((presenter) => presenter.id === user.id),
            )
            .map((item) =>
                allowed.reduce((idx, current) => {
                    idx[current] = item[current];
                    return { value: item.id, label: item.name };
                }, {}),
            );
        console.log(users);
        fields = [
            {
                type: 'Select',
                label: 'Select a user',
                name: 'userId',
                value: 1,
                options: users,
            },
        ];
    };

    const editLinks = async () => {
        let req = handleErrors(await fetch(`/courses/${courseId}/links`));
        links = await req.json();

        let reqLinkTypes = await handleErrors(await fetch(`/courselinktypes`));
        let linktypes = await reqLinkTypes.json();

        let allowed = ['id', 'name'];

        linktypes = linktypes.map((item) =>
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
                label: 'Link type',
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
                label: 'Link',
                placeholder: 'https://your-link.com',
                name: 'uri',
                value: '',
            },
        ];
    };

    // Prefill form fields with existing values
    // TODO: could this be cleaner?
    if (dataTarget === 'course') {
        editCourse();
    } else if (dataTarget === 'presenters') {
        editPresenters();
    } else if (dataTarget === 'links') {
        editLinks();
    } else {
        console.log(`That's not allowed.`);
    }

    const handleSubmit = async (data) => {
        // TODO: Wrap this in the requester so it isn't such a mess.
        // TODO: Handle link, presenter submissions.
        let endpoint = targets[dataTarget].uri;
        let method = targets[dataTarget].method;
        console.log(data);
        result = 'Submitting change...';

        // TODO: Move this into a new form handler
        if (dataTarget === 'course') {
            data.starts = convertToPythonTimestamp(data.starts);
            data.ends = convertToPythonTimestamp(data.ends);
        }

        if (dataTarget === 'presenters') {
            data = { user_ids: [data.userId] };
            console.log(data);
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
            result = 'Successfully upated event.';
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
{#if result}
    <span id="result">{result}</span>
{/if}

<style>
</style>

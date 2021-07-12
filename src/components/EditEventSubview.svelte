<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { convertToPythonTimestamp, handleErrors } from '../utils.js';
    import Form from './FormWrapper.svelte';

    // Get the course data
    export let courseId;
    let fields = [];
    let result = null;

    const d = createEventDispatcher();

    // Prefill form fields with existing values
    onMount(async () => {
        console.log(courseId);
        let req = await fetch(`/courses/${courseId}`);
        let data = await req.json();

        // The object that comes back from the API is bigger than we need for presenters. Filter
        // the object down to the approved keys and build out a form fields array.
        Object.keys(data)
            .filter((item) => {
                const allowed = [
                    'starts',
                    'ends',
                    'course_size',
                    'description',
                    'title',
                ];
                if (allowed.includes(item)) {
                    return true;
                } else {
                    return false;
                }
            })
            .map((key) => {
                let field;
                if (key === 'starts' || key === 'ends') {
                    field = {
                        name: key,
                        id: key,
                        type: 'DateTime',
                        value: data[key],
                        label: key,
                        datetime: new Date().toISOString(),
                    };
                    if (key === 'starts') {
                        field.shift = false;
                    } else {
                        field.shift = true;
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
                } else if (key === 'description') {
                    field = {
                        name: 'description',
                        type: 'TextArea',
                        value: data[key],
                        placeholder: '',
                        label: 'Event description',
                    };
                } else if (key === 'title') {
                    field = {
                        name: 'title',
                        type: 'Input',
                        value: data[key],
                        placeholder: 'Enter title...',
                        label: 'Event Title',
                    };
                }
                fields.push(field);
            });
        fields = fields;
    });

    const handleSubmit = async (data) => {
        data.starts = convertToPythonTimestamp(date.starts);
        data.ends = convertToPythonTimestamp(date.ends);

        let req = handleErrors(
            await fetch(`/courses/${courseId}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );

        if (req.ok) {
            // let response = await req.json();
            result = 'Successully updated event.';
            setTimeout(() => d('success'), 2000);
        }
    };
</script>

{#await fields then fields}
    <Form {fields} onSubmit={(body) => handleSubmit(body)} />
{/await}
{#if result}
    <span id="result">{result}</span>
{/if}

<style>
</style>

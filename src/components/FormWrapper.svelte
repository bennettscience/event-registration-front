<script>
    /*
        This is a generic wrapper component for any forms. Pass in an array of {field} objets to be 
        rendered into the form.

        Submissions are all converted into JSON before being passed back to the parent for handling. This allows the 
        parent compoenent to determine the API route the form is submitting to rather than adding those options here.
     */
    import Input from './formFields/Input.svelte';
    import Select from './formFields/Select.svelte';
    import DateTime from './formFields/DateTime.svelte';
    import Number from './formFields/Number.svelte';
    import TextArea from './formFields/TextArea.svelte';

    // pass in a function handler to onSubmit by the parent.
    export let onSubmit;
    export let fields;

    // Convert fields from [ { name: 'name', value: 'Value' } ] to { name : Value } which is more useful when submitting a form
    const fieldsToObject = (fields) =>
        fields.reduce(
            (item, data) => ({ ...item, [data.name]: data.value }),
            {},
        );

    // When submitting, turn our fields representation into a JSON body and pass back to the parent for handling.
    const handleSubmit = () => onSubmit(fieldsToObject(fields));
</script>

<!-- When submitting, prevent the default action which would result in a refreshed page -->
<form on:submit|preventDefault={() => handleSubmit(fields)}>
    <!-- Loop the fields and render the correct representation based on field.type -->
    {#each fields as field}
        {#if field.type === 'Input'}
            <Input
                name={field.name}
                bind:value={field.value}
                id={field.id}
                label={field.label}
                placeholder={field.placeholder}
            />
        {:else if field.type === 'TextArea'}
            <TextArea
                name={field.name}
                bind:value={field.value}
                id={field.id}
                label={field.label}
                placeholder={field.placeholder}
            />
        {:else if field.type === 'Select'}
            <Select
                name={field.name}
                bind:value={field.value}
                id={field.id}
                label={field.label}
                options={field.options}
            />
        {:else if field.type === 'DateTime'}
            <DateTime
                name={field.name}
                bind:value={field.value}
                id={field.id}
                datetime={field.datetime}
                label={field.label}
                shift={field.shift}
            />
        {:else if field.type === 'Number'}
            <Number
                name={field.name}
                bind:value={field.value}
                id={field.id}
                label={field.label}
                placeholder={field.placeholder}
            />
        {/if}
    {/each}
    <button type="submit">Submit</button>
</form>

<style>
    button {
        position: absolute;
        right: 20px;
        padding: 10px 30px;
        border: 1px solid var(--accent-blue);
        background-color: var(--accent-blue);
        border-radius: 5px;
        transition: all 0.25s ease-in-out;
        font-weight: bold;
        color: var(--text-white);
    }
    button:hover {
        cursor: pointer;
        background-color: var(--text-white);
        color: var(--accent-blue);
    }
</style>

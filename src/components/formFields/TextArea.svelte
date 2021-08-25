<script>
    // TODO: Upgrade to Quill for WYSIWYG editing
    // https://www.npmjs.com/package/svelte-quill
    // https://svelte.dev/repl/0cc84ebc0b114dd7ab5b20b87bbee486?version=3.19.1
    import { onMount, createEventDispatcher } from 'svelte';
    import jodit from '../../jodit.js';

    const dispatch = createEventDispatcher();

    export let value;
    export let placeholder;
    export let label;
    export let id;
    export let name;

    let options = { value: value };
</script>

<label
    ><b>{label}</b>
    <textarea
        use:jodit={options}
        on:text-change={(e) => {
            value = e.detail.text;
        }}
        {placeholder}
    />
</label>

<svelte:head>
    <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/jodit/3.4.25/jodit.min.css"
    />
</svelte:head>

<style>
    :global(.jodit-workplace > div > p) {
        margin: 0;
    }
</style>

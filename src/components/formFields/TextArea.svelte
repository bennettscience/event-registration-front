<script>
    // TODO: Upgrade to Quill for WYSIWYG editing
    // https://www.npmjs.com/package/svelte-quill
    // https://svelte.dev/repl/0cc84ebc0b114dd7ab5b20b87bbee486?version=3.19.1
    import { onMount, createEventDispatcher } from 'svelte';
    import quill from '../../quill';

    const dispatch = createEventDispatcher();

    export let value;
    export let placeholder;
    export let label;
    export let id;
    export let name;

    let options = { value: value };
</script>

<b>{label}</b>
<div
    class="editor"
    use:quill={options}
    on:text-change={(e) => {
        value = e.detail.html;
    }}
    {placeholder}
/>

<style>
    .editor {
        width: 100%;
        margin-bottom: 10px 0;
    }
</style>

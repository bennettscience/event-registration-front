<script>
    // TODO: Upgrade to Quill for WYSIWYG editing
    // https://www.npmjs.com/package/svelte-quill
    // https://svelte.dev/repl/0cc84ebc0b114dd7ab5b20b87bbee486?version=3.19.1
    import { quill } from 'svelte-quill';
    import { onMount } from 'svelte';

    let options;

    onMount(() => {
        options = { placeholder: value };
        value = content.html;
    });

    let content = {
        html: '',
        text: '',
    };

    export let value;
    export let placeholder;
    export let label;
    export let id;
    export let name;
</script>

<b>{label}</b>
<div
    class="editor"
    use:quill={options}
    on:text-change={(e) => (value = e.detail.html)}
    {placeholder}
/>

<style>
    .editor {
        width: 100%;
        margin: 10px 0;
    }
</style>

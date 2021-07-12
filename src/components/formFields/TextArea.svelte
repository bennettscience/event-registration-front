<script>
    export let value;
    export let placeholder;
    export let label;
    export let id;
    export let name;
</script>

<label style="grid-area: {name}"
    >{label}
    <textarea bind:value {placeholder} />
</label>

<style>
    textarea {
        width: 100%;
    }
</style>

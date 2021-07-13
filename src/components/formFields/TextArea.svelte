<script>
    export let value;
    export let placeholder;
    export let label;
    export let id;
    export let name;
</script>

<label style="grid-area: {name}"
    ><b>{label}</b>
    <textarea bind:value {placeholder} />
</label>

<style>
    textarea {
        width: 100%;
        margin: 10px 0;
    }
</style>

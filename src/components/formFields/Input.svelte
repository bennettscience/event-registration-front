<script>
    export let value;
    export let placeholder;
    export let label;
    export let id;
    export let name;
</script>

<label style="grid-area: {name}"
    >{label}
    <input bind:value {placeholder} type="text" />
</label>

<style>
    input {
        width: 100%;
    }
</style>

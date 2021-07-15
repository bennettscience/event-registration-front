<script>
    export let value;
    export let label;
    export let id;
    export let placeholder;
    export let name;
</script>

<label style="grid-area: {name}"
    ><b>{label}</b>
    <input type="number" bind:value {placeholder} />
</label>

<style>
    input {
        width: 100%;
    }
</style>

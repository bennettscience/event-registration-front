<script>
    export let value;
    export let placeholder;
    export let label;
    export let name;
</script>

<label style="grid-area: {name}"
    ><b>{label}</b>
    <input bind:value {placeholder} type="text" tabindex="0" />
</label>

<style>
    input {
        width: 100%;
        margin: 10px 0;
    }
</style>

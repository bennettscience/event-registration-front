<script>
    export let value;
    export let label;
    export let placeholder;
</script>

<label
    ><b>{label}</b>
    <input bind:value {placeholder} type="url" tabindex="0" />
</label>

<style>
    input {
        width: 100%;
        margin: 10px 0;
    }
</style>

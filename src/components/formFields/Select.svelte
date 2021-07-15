<script>
    export let value;
    export let options;
    export let label;
    export let id;
    export let name;

    let selected = '';
    console.log(options);
</script>

<label style="grid-area:{name}"
    ><b>{label}</b>
    <select bind:value {id}>
        {#each options as option}
            <option value={option.value} selected={value === option.value}
                >{option.label}</option
            >
        {/each}
    </select>
</label>

<style>
    select {
        width: 100%;
    }
</style>

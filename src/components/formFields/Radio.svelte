<script>
    export let value;
    export let name;
    export let label;
    export let options;
</script>

<b>{label}</b>
{#each options as option}
    <label
        ><b>{option.text}</b>
        <input
            type="radio"
            bind:group={value}
            value={option.val}
            {name}
            tabindex="0"
        />
    </label>
{/each}

<style>
    input {
        width: 100%;
    }
</style>

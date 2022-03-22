<script>
    export let value;
    export let name;
    export let label;
    export let options;
</script>

<b>{label}</b>
<div id="option-container">
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
</div>

<style>
    #option-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    input {
        display: inline;
        width: auto;
        margin-left: 0.75rem;
    }
</style>

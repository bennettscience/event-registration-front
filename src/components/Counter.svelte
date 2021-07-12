<script>
    // Display a large number from a prop
    export let label = '';
    export let count = 0;
</script>

<div class="counter">
    <span class="label">{label}</span>
    <span class="count">{count}</span>
</div>

<style>
    .counter {
        padding: 10px;
        border-radius: 5px;
        border: 3px solid var(--accent-blue);
    }
    .label {
        display: block;
        width: 100%;
        text-align: center;
        text-transform: uppercase;
        font-size: 24px;
        font-weight: 300;
        margin-bottom: 0;
    }
    .count {
        display: block;
        text-align: center;
        font-weight: 800;
        padding: 0;
        font-size: 16px;
    }
</style>

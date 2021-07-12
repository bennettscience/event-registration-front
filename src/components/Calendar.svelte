<script>
    let w;
    let h;
    let size = 60;
</script>

<!-- <input type=range bind:value={size}> -->

<div class="calendar" bind:clientHeight={h} bind:clientWidth={w}>
    <div class="month">
        <slot name="month" />
    </div>
    <div class="date" style="font-size: {size}px">
        <slot name="date" />
    </div>
</div>

<style>
    .calendar {
        display: block;
        padding: 10px;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-radius: 5px 0 0 5px;
        width: 100px;
        border: 3px solid var(--accent-blue);
    }
    .month {
        width: 100%;
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 300;
        margin-bottom: 0;
        transform: scale(0.85, 1.2);
    }
    .date {
        text-align: center;
        font-weight: 800;
        padding: 0;
    }
</style>

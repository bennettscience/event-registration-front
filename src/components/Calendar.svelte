<script>
    let w;
    let h;
</script>

<!-- <input type=range bind:value={size}> -->

<div class="calendar" bind:clientHeight={h} bind:clientWidth={w}>
    <div class="day">
        <slot name="day" />
    </div>
    <div class="date">
        <slot name="date" />
    </div>
</div>

<style>
    .calendar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        height: 100%;
        padding: 10px;
        background-color: var(--accent-blue);
        color: var(--text-white);
        border-radius: 5px 0 0 5px;
        width: 100%;
        border: 3px solid var(--accent-blue);
    }
    .day {
        width: 100%;
        text-align: center;
        font-size: 24px;
        font-weight: 300;
        margin-bottom: 0;
        transform: scale(0.85, 1.2);
    }
    .date {
        text-align: center;
        font-size: 36px;
        font-weight: 800;
        padding: 0;
    }

    @media only screen and (max-width: 767px) {
        .calendar {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .day {
            width: auto;
            font-size: 24px;
        }
        .date {
            font-size: 32px;
        }
    }
</style>

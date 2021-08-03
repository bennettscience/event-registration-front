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
    <div class="date">
        <slot name="date" />
    </div>
</div>

<style>
    .calendar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        height: 100%;
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
        font-size: 60px;
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
        .month {
            width: auto;
            font-size: 24px;
        }
        .date {
            font-size: 32px;
        }
    }
</style>

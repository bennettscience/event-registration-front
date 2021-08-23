<script>
    export let value;
    export let label;
    export let datetime;
    // export let id;
    export let name;

    let today = new Date(value);

    function shiftISOTime(datetime) {
        let timeZone = today.getTimezoneOffset() * 60 * 1000;
        let local = today - timeZone;
        let localDate = new Date(local).toISOString();
        return localDate.slice(0, -8);
    }

    value = shiftISOTime(datetime);

    // if (!shift) {
    // } else {
    //     value = shiftISOTime(new Date(today.setHours(today.getHours() + 1)));
    // }
</script>

<label style="grid-area: {name}"
    ><b>{label}</b>
    <input type="datetime-local" bind:value /></label
>

<style>
    input {
        width: 100%;
    }
</style>

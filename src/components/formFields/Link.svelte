<script>
    export let value;
    export let label;
    export let placeholder;

    // TODO: Get link types to populate a select
    // const getTypes = async () => {
    //     let req = handleErrors(await fetch(`/courselinktypes`));
    //     let resp = await req.json();
    //     console.log(resp);
    //     return resp;
    // };
</script>

<label
    ><b>{label}</b>
    <input bind:value {placeholder} type="url" />
</label>

<style>
    input {
        width: 100%;
        margin: 10px 0;
    }
</style>

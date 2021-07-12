<script>
    let user;
    async function handleAuth() {
        let req = await fetch(`/authorize/google`);
        console.log(req);
        let data = await req.json();

        user = data.name;
        console.log(user);
    }
</script>

<p>Please log in to continue</p>
<button on:click={handleAuth}>Log in with Google</button>
<p>{user}</p>

<style>
    /* your styles go here */
</style>

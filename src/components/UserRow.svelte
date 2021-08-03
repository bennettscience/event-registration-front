<script>
    import { handleErrors } from '../utils';

    export let name;
    export let id;
    export let location;
    export let email;
    export let role;

    let value = role.id;

    let options = [
        {
            label: 'SuperAdmin',
            value: 1,
        },
        {
            label: 'Presenter',
            value: 2,
        },
        {
            label: 'Observer',
            value: 3,
        },
        {
            label: 'User',
            value: 4,
        },
    ];

    const handleChange = async () => {
        let req = handleErrors(
            await fetch(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ usertype_id: value }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        );
        let data = await req.json();
        console.log(data);
    };
</script>

<tr data-id={id}>
    <td>{name}</td>
    <td>Coming soon!</td>
    <td>{email}</td>
    <td>
        <select bind:value {id} on:blur={handleChange}>
            {#each options as option}
                <option value={option.value} selected={value === option.value}
                    >{option.label}</option
                >
            {/each}
        </select>
    </td>
</tr>

<style>
    tr:nth-child(even) {
        background-color: var(--site-gray);
    }

    td {
        background-clip: padding-box;
        scroll-snap-align: start;
        padding: 0.6rem;
        min-width: 6rem;
        text-align: left;
    }
    tr > td:last-of-type:hover {
        cursor: pointer;
    }
</style>

<script>
    import { createEventDispatcher } from 'svelte';
    import { handleErrors } from '../utils';

    const d = createEventDispatcher();

    export let name;
    export let id;
    export let email;
    export let role;
    export let location;

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
    };

    const editUser = () => {
        d('editUser', { userId: id });
    };
</script>

<tr data-id={id}>
    <td>{name.split(' ').reverse().splice(0, 2).join(', ')}</td>
    <td>{location.name}</td>
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
    <td>
        <span
            tabindex="0"
            role="button"
            on:click={editUser}
            on:keypress={(e) => {
                if (e.key === 'Enter') {
                    editUser();
                }
            }}>Edit</span
        >
    </td>
</tr>

<style>
    span {
        border: 1px solid var(--site-gray);
        border-radius: 5px;
        padding: 10px 30px;
        transition: all 0.25s ease-in-out;
    }
    span:hover {
        cursor: pointer;
        background-color: var(--site-gray);
        border-color: var(--site-gray);
    }
    tr {
        box-sizing: border-box;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        transition: all 0.25s ease-in-out;
    }
    tr:hover {
        border-bottom: 1px solid var(--site-gray);
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

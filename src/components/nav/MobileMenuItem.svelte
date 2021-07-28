<script>
    import * as icons from '../../assets/icons.js';
    export let href;
    export let icon;
    export let item;
    export let current;

    let logout = false;

    if (item === 'logout') {
        logout = true;
    }
</script>

<span
    class:logout
    class:active={current === item}
    on:click={() => {
        current = item;
    }}
>
    <a {href}
        ><svg
            fill="none"
            viewBox="0 0 24 24"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg">{@html icons[icon]}</svg
        ></a
    >
</span>

<style>
    span {
        display: flex;
        height: 56px;
        align-items: center;
        list-style-type: none;
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
        padding-left: 20px;
        color: var(--text-wite);
        border-left: 3px solid;
        border-color: transparent;
        box-sizing: border-box;
        cursor: pointer;
    }

    span:not(.logout):hover {
        background-color: var(--accent-hover);
        border-left: 3px solid;
        border-color: var(--accent-active);
    }

    .logout {
        background-color: var(--accent-red);
        position: absolute;
        bottom: 0;
        width: 256px;
    }

    .active {
        background-color: var(--accent-hover);
        border-left: 3px solid;
        border-color: var(--accent-active);
    }

    a {
        text-decoration: none;
        color: var(--text-white);
        flex: 1;
    }

    svg {
        vertical-align: middle;
        margin-right: 12px;
    }
</style>

<script>
    import { circle, circleCheck } from '../assets/icons.js';
    export let state;

    console.log(state);

    let userStates = {
        registered: {
            icon: circle,
            label: 'Registered',
        },
        attended: {
            icon: circleCheck,
            label: 'Attended',
        },
    };

    let userState = userStates[state];
</script>

<div class={state}>
    <svg
        fill="none"
        viewBox="0 0 24 24"
        height="16"
        width="16"
        xmlns="http://www.w3.org/2000/svg">{@html userState.icon}</svg
    >
    <p>
        {userState.label}
    </p>
</div>

<style>
    div {
        display: flex;
        align-items: center;
    }
    p {
        margin-left: 4px;
    }
    .registered {
        color: var(--site-gray);
    }
    .attended {
        color: var(--accent-active);
    }
</style>

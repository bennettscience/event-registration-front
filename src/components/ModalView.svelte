<script>
    import Loader from './Loader.svelte';
    export let onSubmit;
    export let confirmRequired = false;
    export let modalText;
    export let isModalOpen = false;
    export let loading = false;

    function open() {
        isModalOpen = true;
    }
    function close() {
        isModalOpen = false;
    }
    // Wrapper component to handle modals. SubModalViews can be loaded
    // and API requests remain generic.
    const handleSubmit = () => onSubmit();
</script>

{#if isModalOpen}
    <div class="modal">
        <div class="backdrop" on:click={close} />
        <div class="content-wrapper">
            <div class="modal-header"><h1>{modalText.heading}</h1></div>
            <div class="modal-content">
                <p>{modalText.content}</p>
            </div>
            <div name="footer" {close}>
                {#if loading}
                    <Loader dark="true" />
                {:else if confirmRequired}
                    <button id="confirm" on:click={handleSubmit}>Confirm</button
                    >
                    <button id="cancel" on:click={close}>Cancel</button>
                {:else}
                    <button id="cancel" on:click={close}>Close</button>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 1000;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
    }
    .content-wrapper {
        position: relative;
        z-index: 10;
        max-width: 70vw;
        border-radius: 5px;
        background-color: var(--text-white);
        overflow: hidden;
        padding: 40px;
        box-shadow: var(--box-shadow);
    }

    .modal-content {
        max-height: 50vh;
        height: 25vh;
        width: 25vw;
        overflow: auto;
    }
    div[name='footer'] {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 15px;
    }
    button {
        padding: 10px 30px;
        border-radius: 5px;
        transition: all 0.25s ease-in-out;
        font-weight: bold;
    }
    button:hover {
        cursor: pointer;
    }
    #confirm {
        color: var(--text-white);
        border: 1px solid var(--accent-blue);
        background-color: var(--accent-blue);
    }
    #cancel {
        border: 1px solid var(--site-dark);
        font-weight: normal;
    }
    #confirm:hover {
        background-color: var(--text-white);
        color: var(--accent-blue);
    }
</style>

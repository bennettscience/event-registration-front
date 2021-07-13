<script>
    export let modalText;
    export let isModalOpen = false;
    function open() {
        isModalOpen = true;
    }
    function close() {
        isModalOpen = false;
    }
    // Wrapper component to handle modals. SubModalViews can be loaded
    // and API requests remain generic.
    const handleSubmit = () => {};
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
                <button on:click={close}>close</button>
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
    button {
        position: absolute;
        bottom: 20px;
        padding: 15px 40px;
        border: 1px solid var(--accent-blue);
        background-color: var(--accent-blue);
        border-radius: 5px;
        transition: all 0.25s ease-in-out;
        font-weight: bold;
        color: var(--text-white);
    }
    button:hover {
        cursor: pointer;
        background-color: var(--text-white);
        color: var(--accent-blue);
    }
</style>

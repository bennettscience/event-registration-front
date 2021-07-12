<script>
    let isOpen = false;
    function open() {
        isOpen = true;
    }
    function close() {
        isOpen = false;
    }
    // Wrapper component to handle modals. SubModalViews can be loaded
    // and API requests remain generic.
    const handleSubmit = () => {};
</script>

<slot name="trigger" {open}>
    <button on:click={open}>Open</button>
</slot>

{#if isOpen}
    <div class="modal">
        <div class="backdrop" on:click={close} />
        <div class="content-wrapper">
            <slot name="modal-header">
                <div class="modal-header"><h1>This is the headr</h1></div>
            </slot>
            <div class="modal-content">
                <slot name="content" />
            </div>
            <slot name="footer" {close}>
                <div class="modal-footer"><p>This is the foot</p></div>
                <button on:click={close}>close</button>
            </slot>
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
        justify-items: center;
        align-items: center;
    }

    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
    }
    .content-wrapper {
        z-index: 10;
        max-width: 70vw;
        border-radius: 5px;
        background-color: var(--text-white);
        overflow: hidden;
    }

    .modal-content {
        max-height: 50vh;
        overflow: auto;
    }
</style>

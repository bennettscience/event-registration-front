<script>
    import { fade, fly } from 'svelte/transition';
    import { formatDate } from '../../utils';
    import LogTable from './LogTable.svelte';
    import Loader from '../Loader.svelte';

    export let courseId;
    export let isLogTableOpen;

    const viewEventLogs = async () => {
        let req = await fetch(`/logs/${courseId}`);
        let data = await req.json();
        isLogTableOpen = true;

        let eventLogs = data.map((item) => {
            item.occurred = formatDate('starts', new Date(item.occurred));
            item.json_data = JSON.parse(item.json_data);
            return item;
        });

        return eventLogs;
    };

    function open() {
        isLogTableOpen = true;
    }
    function close() {
        isLogTableOpen = false;
    }
</script>

{#if isLogTableOpen}
    <div class="modal">
        <div class="backdrop" on:click={close} transition:fade />
        <div class="content-wrapper" transition:fly={{ y: 200, duration: 500 }}>
            <div class="modal-content">
                {#await viewEventLogs()}
                    <Loader />
                {:then data}
                    <LogTable {data} />
                {/await}
            </div>
            <div name="footer" {close}>
                <button id="cancel" on:click={close}>Close</button>
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
        width: 90%;
        height: 75%;
        border-radius: 5px;
        background-color: var(--text-white);
        padding: 40px;
        box-shadow: var(--box-shadow);
    }

    .modal-content {
        position: relative;
        height: 90%;
        overflow: auto;
        margin-bottom: 10px;
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
        background-color: var(--site-dark);
        color: var(--text-white);
    }
    #cancel {
        border: 1px solid var(--site-dark);
        font-weight: normal;
    }
</style>

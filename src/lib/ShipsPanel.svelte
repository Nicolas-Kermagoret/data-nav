<script>
    import DataUpload from "./DataUpload.svelte";
    import ShipsList from "./ShipsList.svelte";
    let openedTab = "upload";

    function handleDataUpload(event) {
        openedTab = "ship-list";
    }
</script>

<div class="ships-panel">
    <div class="tabs">
        <div
            class="tab {openedTab === 'ship-list' ? 'opened-tab' : ''}"
            on:click={() => (openedTab = "ship-list")}
        >
            Ships
        </div>
        <div
            class="tab {openedTab === 'upload' ? 'opened-tab' : ''}"
            on:click={() => (openedTab = "upload")}
        >
            Upload
        </div>
    </div>
    <div class="opened-panel">
        {#if openedTab === "upload"}
            <DataUpload on:data-uploaded={handleDataUpload} />
        {:else if openedTab === "ship-list"}
            <ShipsList/>
        {/if}
    </div>
</div>

<style>
    .ships-panel {
        display: flex;
        flex-direction: column;
        flex: 0 0 auto;
        width: 20%;
    }
    .tabs {
        display: flex;
        flex-direction: row;
    }
    .tab {
        padding: 8px;
        background-color: rgb(209, 209, 209);
        flex: 1 0 auto;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
    }
    .opened-tab {
        background-color: rgb(226, 226, 226);
    }
    .opened-panel {
        overflow: auto;
        background-color: rgb(226, 226, 226);
        height: 100%;
        border-radius: 0 0 8px 8px;
        padding: 16px 8px;
    }
</style>

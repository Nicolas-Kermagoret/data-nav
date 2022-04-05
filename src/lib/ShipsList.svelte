<script>
    import { ships } from "../store";
    import Ship from "./Ship.svelte";
    import { onDestroy } from "svelte";
    import { empty } from "svelte/internal";
    let shipsList;
    const unsubscribe = ships.subscribe((value) => {
        shipsList = value;
    });
    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="ships-list">
    {#if shipsList && shipsList.length > 0}
        {#each shipsList as ship}
            <Ship {ship} />
        {/each}
    {:else}
    <div class="empty-list">
        Ship list is empty, upload a file
    </div>
    {/if}
</div>

<style>
    .ships-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .empty-list {
        padding: 16px;
    }
</style>

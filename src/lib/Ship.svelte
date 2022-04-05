<script>
    import { selectedShip, dateRange } from "../store";
    import { onDestroy } from "svelte";
    import dayjs from "dayjs";

    export let ship;
    let expanded = false;
    const firstRecord = ship.data[0];
    const lastRecord = ship.data[ship.data.length - 1];
    const range = [
        dayjs(firstRecord.datetime).format("YYYY-MM-DD"),
        dayjs(lastRecord.datetime).format("YYYY-MM-DD"),
    ];
    const selectedRange = { from: range[1], to: range[1] };
    const unsubscribe = selectedShip.subscribe((value) => {
        expanded = value && ship.mmsi === value.mmsi;
    });

    onDestroy(() => {
        unsubscribe();
    });

    function expandShip() {
        if (!expanded) {
            selectedShip.set(ship);
            dateRange.set(selectedRange);
        }
    }

    function updateDateRange() {
        dateRange.set(selectedRange);
    }
</script>

<div class="ship" on:click={expandShip}>
    <div class="ship-infos">
        <span>
            <b>MMSI:</b> {ship.mmsi}
        </span>
        <span>
            <b>Name:</b> {ship.name}
        </span>
    </div>
    {#if expanded}
        <div class="expanded">
            <span>
            <b>Length:</b> {ship.length}m, <b>Width:</b> {ship.width}m
            </span>

            <div>Select a date range to display:</div>
            <div class="range">
                <input
                    type="date"
                    bind:value={selectedRange.from}
                    min={range[0]}
                    max={selectedRange.to}
                    required
                    on:change={updateDateRange}
                />
                ->
                <input
                    type="date"
                    bind:value={selectedRange.to}
                    min={selectedRange.from}
                    max={range[1]}
                    required
                    on:change={updateDateRange}
                />
            </div>
            <div>Last known data:</div>
            <div><b>Date: </b>{lastRecord.datetime}</div>
            <div><b>Position: </b>[{lastRecord.lat}, {lastRecord.lon}]</div>
            <div><b>Speed: </b>{lastRecord.sog}knots</div>
            <div><b>Heading: </b>{lastRecord.cog}°</div>
        </div>
    {/if}
</div>

<style>
    .ship {
        cursor: pointer;
        background-color: rgb(215, 215, 215);
        padding: 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .ship-infos {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    .expanded {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
</style>

<script>
    import Papa from "papaparse";
    import { ships } from "../store";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let files;
    let processing = false;
    let noDataFound = false;
    let mmsiFilter = '';
    $: canUpload =
        files && files.length === 1 && mmsiFilter !== "" && !processing;

    function handleFiles() {
        if (!processing) {
            processing = true;
            noDataFound = false;
            const file = files && files[0];
            const shipsToUpload = {};
            const mmsiToIncludes = mmsiFilter.replace(/\s/g, "").split(",");
            Papa.parse(file, {
                delimiter: "\t",
                header: true,
                step: (result) => {
                    if (
                        result.data &&
                        mmsiToIncludes.includes(result.data.mmsi)
                    ) {
                        const { data } = result;
                        if (data.mmsi) {
                            if (!shipsToUpload[data.mmsi]) {
                                shipsToUpload[data.mmsi] = {
                                    mmsi: data.mmsi,
                                    id: data.ship_id,
                                    name: data.name,
                                    width: data.width,
                                    length: data.length,
                                    data: [],
                                };
                            }
                            shipsToUpload[data.mmsi].data.push({
                                lon: data.lon,
                                lat: data.lat,
                                datetime: data.datetime,
                                id: data.id,
                                sog: data.sog,
                                cog: data.cog,
                            });
                        }
                    }
                },
                complete: () => {
                    const shipsArray = Object.values(shipsToUpload);
                    if (shipsArray && shipsArray.length > 0) {
                        ships.set(shipsArray);
                        dispatch("data-uploaded");
                    } else {
                        noDataFound = true;
                    }
                    processing = false;
                    files = [];
                },
            });
        }
    }
</script>

<div class="data-upload">
    <div>Upload AIS dataset:</div>
    <input type="file" id="file_input" name="file_input" bind:files/>
    <div>Specify MMSI numbers to filter in dataset separated by comma:</div>
    <textarea
        bind:value={mmsiFilter}
        placeholder="247389200, 225416000, 247322800"
    />
    {#if noDataFound}
        <div class="error">
            ⚠️ No ships found, check your file or MMSI filters
        </div>
    {/if}
    <button
        class={!canUpload ? "button-disabled" : ""}
        on:click={handleFiles}
        disabled={!canUpload}
        >Upload
        {#if processing}
            <div class="loader" />
        {/if}
    </button>
</div>

<style>
    .data-upload {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
    }
    button {
        font-family: inherit;
        font-size: inherit;
        padding: 8px;
        background-color: #ff3e00;
        color: white;
        border-radius: 2em;
        border: 2px solid #ff3e00;
        outline: none;
        width: 200px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;
    }
    .button-disabled {
        background-color: #fd9674;
        border: 2px solid #fd9674;
    }
    .loader {
        border: 2px solid #f3f3f3;
        border-top: 2px solid #ff3e00;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        animation: spin 2s linear infinite;
    }
    textarea {
        resize: none;
        min-width: 90%;
        min-height: 7em;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

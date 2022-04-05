<script>
  import Map from "./lib/Map.svelte";
  import ShipsPanel from "./lib/ShipsPanel.svelte";
</script>

<main>
  <Map />
  <ShipsPanel />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
</style>

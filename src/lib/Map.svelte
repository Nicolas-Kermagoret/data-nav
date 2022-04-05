<script>
    import * as L from "leaflet";
    import { RotatedMarker } from "leaflet-marker-rotation";
    import { ships, selectedShip, dateRange } from "../store";
    import { onDestroy } from "svelte";
    import LeafletHotline from "leaflet-hotline";
    import chevron from "../assets/chevron-up.svg";
    import { isDayBetween } from "../utils/date.util";

    LeafletHotline(L);

    let map;
    let polylinesGroupLayer;
    let displayedShip;

    const chevronIcon = L.icon({
        iconUrl: chevron,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    });

    function createMap(container) {
        // Initialize the map
        const map = L.map(container);

        // Set the position and zoom level of the map
        map.setView([28.210037, -16.032647], 4);

        // Add base layer
        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        return map;
    }

    function mapAction(container) {
        map = createMap(container);
        polylinesGroupLayer = L.layerGroup().addTo(map);
        return {
            destroy: () => {
                map.remove();
            },
        };
    }

    function stringToColour(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = "#";
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xff;
            colour += ("00" + value.toString(16)).substr(-2);
        }
        return colour;
    }

    function createArrowIcon(mmsi, angle) {
        return L.divIcon({
            iconSize: [20, 20],
            className: "ship-icon",
            html: `<?xml version="1.0" encoding="UTF-8"?><svg style="transform: rotate(${angle}deg);" version="1.1" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg"><path style="fill: ${stringToColour(
                mmsi
            )}" d="m105.27 0.69784-104.88 295.98 104.88-44.396 104.88 44.396z" stroke="#000" stroke-width=".46616px"/></svg>`,
        });
    }

    function displayTrajectory(ship, range) {
        polylinesGroupLayer.clearLayers();
        const points = [];
        const lastRecord = ship.data[ship.data.length - 1];
        if (!range) {
            range = { from: lastRecord.datetime, to: lastRecord.datetime };
        }
        ship.data.forEach((record, index) => {
            if (isDayBetween(record.datetime, range)) {
                const point = [record.lat, record.lon, record.sog];
                points.push(point);
                if (index !== ship.data.length -1) {
                    polylinesGroupLayer.addLayer(
                        new RotatedMarker(point, {
                            icon: chevronIcon,
                            rotationAngle: record.cog,
                            rotationCenter: "center",
                        })
                        // @ts-ignore
                        .bindPopup(`<b>MMSI</b>: ${ship.mmsi}<br>
                      <b>Date</b>: ${record.datetime}<br>
                      <b>Position</b>: ${point}<br>
                      <b>Speed</b>: ${record.sog} knots<br>
                      <b>Heading</b>: ${record.cog}°<br>`)
                    );
                }
            }
        });
        polylinesGroupLayer.addLayer(
            // @ts-ignore
            L.hotline(points, {
                weight: 2,
                min: 0,
                max: 30,
                outlineWidth: 0,
            })
        );
        map.setView([lastRecord.lat, lastRecord.lon], 8);
    }

    function addPoints(ship) {
        if (ship && ship.data && ship.data.length > 0) {
            const lastRecord = ship.data[ship.data.length - 1];
            const point = [lastRecord.lat, lastRecord.lon];
            L.marker(point, {
                icon: createArrowIcon(ship.mmsi, lastRecord.cog),
            })
                // @ts-ignore
                .addTo(map)
                .bindPopup(
                    `<b>MMSI</b>: ${ship.mmsi}<br>
    <b>Date</b>: ${lastRecord.datetime}<br>
    <b>Position</b>: ${point}<br>
    <b>Speed</b>: ${lastRecord.sog} knots<br>
    <b>Heading</b>: ${lastRecord.cog}°<br>`
                )
                .on("click", () => {
                    if (!displayedShip || displayedShip.mmsi !== ship.mmsi)
                        selectedShip.set(ship);
                });
        }
    }

    const unsubscripeShips = ships.subscribe((value) => {
        value.forEach((ship) => {
            addPoints(ship);
        });
    });
    const unsubscribeSelectedShip = selectedShip.subscribe((value) => {
        if (value) {
            displayedShip = value;
            displayTrajectory(value);
        }
    });

    const unsubscribeDateRange = dateRange.subscribe((value) => {
        if (value) {
            displayTrajectory(displayedShip, value);
        }
    });

    onDestroy(() => {
        unsubscripeShips();
        unsubscribeSelectedShip();
        unsubscribeDateRange();
    });
</script>

<div id="map" use:mapAction />

<style>
    @import "../../node_modules/leaflet/dist/leaflet.css";
    #map {
        display: flex;
        flex: 1 0 auto;
        height: 800px;
        z-index: 0;
    }
</style>

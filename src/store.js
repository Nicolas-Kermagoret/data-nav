import { writable } from 'svelte/store';

export const ships = writable([]);
export const selectedShip = writable();
export const dateRange = writable()
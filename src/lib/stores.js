import { browser } from "$app/environment";
import { writable, get } from 'svelte/store';

const LFLData = (key, initValue) => {
    const store = writable(initValue);
    if (!browser) {
        return store;
    }

    const storedLFLData = localStorage.getItem("LFLData");
    if (storedLFLData != null) {
        store.set(JSON.parse(storedLFLData));
    }

    store.subscribe((value) => {
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    window.addEventListener('storage', () => {
        if (storedLFLData == null) {
            return;
        }

        const LFLDataCollection = JSON.parse(storedLFLData);
        if (LFLDataCollection !== get(store)) {
            store.set(LFLDataCollection);
        }
    });

    return store;
};

export default LFLData;
import { browser } from "$app/environment";
import { writable, get, derived } from 'svelte/store';

import { parseArrayOfJsonStrings } from "$helpers/generators";
import { parseUploadedMatchData } from "$helpers/tournamentData";
import { aggregateMatchesByTimeAndParticipatingTeams } from "$helpers/teamsData";

const key = "LFLData";

function isLFLDataStored() {
    return localStorage.getItem(key);
}

function mergeUploadedStoredLFLData(parsedUploadData) {
    let parsedMatchData = aggregateMatchesByTimeAndParticipatingTeams(parsedUploadData);
    const storedLFLData = isLFLDataStored();

    // Vispirms iet cauri katram augšupielādētajam failam un pārbauda, vai tajā nav 
    
    if (storedLFLData != null) {
        // Ievietot loģiku, kas apstrādā jau saglabātos mačus.
        // Pēc maču pārbaudes apvieno jaunos kopā ar vecajiem un saglabā iekš localStorage
        parsedMatchData = [...parseUploadedMatchData(parsedMatchData, JSON.parse(storedLFLData))];
    }

    if (parsedMatchData.length > 0) {
        localStorage.setItem(key, JSON.stringify(parsedMatchData));
    }
}

const getLFLData = () => {
    const initialStore = writable([]);

    const {subscribe, set} = initialStore;

    if (!browser) {
        return initialStore;
    }

    // Nosaka, kā apstrādāt katru jauno pievienoto vērtību
    subscribe((value) => {
        if (value === null || value === undefined) {
            console.log("Is data empty?");
            localStorage.removeItem(key);
        } else {
            const parsedUploadData = parseArrayOfJsonStrings(value);

            if (parsedUploadData.length > 0) {
                console.log("Set new value:", parsedUploadData);
                mergeUploadedStoredLFLData(parsedUploadData);
            }
        }
    });

    // window.addEventListener('storage', () => {
    //     const savedLFLData = localStorage.getItem(key);
    //     if (savedLFLData == null) {
    //         return;
    //     }

    //     const LFLDataCollection = JSON.parse(savedLFLData);
    //     set(LFLDataCollection);
    // });

    return {
        subscribe,
        set: (value) => (set(value)),
        getData: () => {
            return JSON.parse(localStorage.getItem(key)) ?? [];
        }
    };
};

export const LFLData = getLFLData();

export const LFLMatchTeams = derived(
    LFLData,
    $LFLData => {
        console.log("Data when trying to fetch teams:", $LFLData[0]);
    }
);
/**
 * Atgriež funkciju, kuru izsaucot var iegūt sarakstu ar komandām, izmantojot Svelte "stores" funkcionalitāti un saglabāto "LFLData" datu kolekciju.
 * Kad šo "stores" objektu izsauc, tas izsauks funkciju, kas definēta iekš "teams" objekta (pašā funkcijas ķermenī)
 * 
 * Pie derived funkcijas: 
 *      Pirmais parametrs (LFLData) - "stores" objekts, no kura paņem datus agregātfunkcijai (2. parametram)
 *      Otrais parametrs - agregātfunkcija, kas paņem padoto "stores" objekta un atgriež rezultātu, ko iegūst pēc šī objekta apstrādes
 */
// export const LFLMatchTeams = derived(
//     LFLData,
//     $LFLData => {
//         //
//     }
// );
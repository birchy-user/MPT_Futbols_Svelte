import { browser } from "$app/environment";
import { writable, get, derived } from 'svelte/store';

import { parseArrayOfJsonStrings } from "$helpers/generators";
import { parseUploadedMatchData } from "$helpers/tournamentData";
import { aggregatePlayersOfTeamsByScoredGoals } from "$helpers/topScorerData";

const key = "LFLData";

function mergeUploadedStoredLFLData(parsedUploadData) {
    let uploadDataUnpackedByMatchProperty = parsedUploadData.map(matchData => matchData.Spele);
    let parsedMatchData = [...parseUploadedMatchData(uploadDataUnpackedByMatchProperty)];
    
    const storedLFLData = localStorage.getItem(key);
    if (storedLFLData != null) {
        // Ievietot loģiku, kas apstrādā jau saglabātos mačus.
        // Pēc maču pārbaudes apvieno jaunos kopā ar vecajiem un saglabā iekš localStorage
        
        // let combinedMatchData = JSON.parse(storedLFLData).concat(parsedMatchData);


        // Ja localStorage jau ir saglabāti dati, tos apvieno un savā starpā pārbauda (katru )
        parsedMatchData = [...parseUploadedMatchData(parsedMatchData, JSON.parse(storedLFLData))];
    }

    if (parsedMatchData.length > 0) {
        localStorage.setItem(key, JSON.stringify(parsedMatchData));
    }

    return parsedMatchData;
}

function getLFLData() {
    const initialStore = writable([]);

    const {subscribe, update, set} = initialStore;

    if (!browser) {
        return initialStore;
    }

    return {
        subscribe,
        setData: (value) => {
            let valueToStore = [];

            if (value === null || value === undefined) {
                console.log("Is data empty?");
                localStorage.removeItem(key);
            } else {
                valueToStore = parseArrayOfJsonStrings(value);

                console.log("Value is being set:", valueToStore);

                if (valueToStore.length > 0) {
                    valueToStore = mergeUploadedStoredLFLData(valueToStore);
                }
            }

            set(valueToStore);
        },
        // getStoredData: () => {
        //     return JSON.parse(localStorage.getItem(key)) ?? [];
        // }
    };
};

function getLFLMatchesData($LFLData) {
    let result = $LFLData;

    if ($LFLData.length > 0 === false) {
        // return LFLData.getStoredData();

        if (browser) {
            result = JSON.parse(localStorage.getItem(key)) ?? [];
        }
    }

    return result;
}

export const LFLData = getLFLData();

// Visi mači (spēles) no iepriekš augšupielādētajiem mačiem (ja nekas vēl nav augšupielādēts, tad neko neatgriež)
export const LFLMatches = derived(
    LFLData,
    $LFLData => getLFLMatchesData($LFLData)
);

// Saraksts ar komandām, kuras piedalījās LFL mačos (katrs ieraksts ir saraksts ar divām komandām, kas piedalījās mačā):
export const LFLTeamsByMatches = derived(
    LFLMatches,
    $LFLTeamsByMatches => $LFLTeamsByMatches.map(matchData => matchData.Komanda)
);

// Saraksts ar visiem sodiem katrā mačā
export const LFLFoulsByMatches = derived(
    LFLTeamsByMatches,
    $LFLFoulsByMatches => {
        return $LFLFoulsByMatches.map(teamsOfMatch => {
            let result = teamsOfMatch.reduce((finalFouls, teamData) => {
                const teamName = teamData.Nosaukums;
                let teamFouls = teamData.Sodi;
                
                if (teamFouls !== "") {
                    const teamFoulsInner = teamFouls.Sods;
                    if (teamFoulsInner.constructor.name == "Array") {
                        teamFoulsInner.forEach(foul => {
                            finalFouls.push({
                                ...foul, 
                                KomandasNosaukums: teamName
                            });
                        });
                    } else if (teamFoulsInner.constructor.name == "Object") {
                        finalFouls.push({...teamFoulsInner, KomandasNosaukums: teamName});
                    }
                }
        
                return finalFouls;
            }, []);
            
            return result; 
        });
    }
)

// Saraksts ar visiem vecākajiem tiesnešiem (VT) no visiem LFL mačiem:
export const LFLRefereesByMatches = derived(
    LFLMatches,
    $LFLRefereesByMatches => $LFLRefereesByMatches.map(matchData => matchData.VT)
);

// Kad visu maču sodu un vecāko tiesnešu saraksti tiek atjaunināti, tad atkal atjauno apvienoto sarakstu,
// kur katrs ieraksts ir objekts, kas satur informāciju par i-tā mača vecāko tiesnesi un viņa piešķirtajiem sodiem i-tā mača laikā
export const LFLRefereesByReportedFouls = derived(
    [LFLFoulsByMatches, LFLRefereesByMatches],
    ([$LFLFoulsByMatches, $LFLRefereesByMatches]) => {
        let refereesByReportedFoulsMap = $LFLRefereesByMatches.reduce((acc, referee, index) => {
            let goalsForRefereeInMatch = $LFLFoulsByMatches[index];

            let result = {
                ...referee,
                Sodi: goalsForRefereeInMatch
            };

            acc.push(result);

            return acc;
        }, []);

        return refereesByReportedFoulsMap;
    }
);

// Līdzīgs sarakstam "LFLRefereesByReportedFouls", taču šeit katram tiesnesim papildus tiek atgriezts kopā piešķirto sodu skaits, 
// kā arī vidēji piešķirto sodu skaits vienā spēlē:
export const LFLRefereesByAverageFoulsInEachMatch = derived(
    LFLRefereesByReportedFouls,
    $LFLRefereesByReportedFouls => {
        let totalFoulsByReferee = {},
            totalMatchesByReferee = {},
            results = [];

        for (let i = 0; i < $LFLRefereesByReportedFouls.length; i++) {
            const [refereeName, refereeLastname, refereeFouls] = Object.values($LFLRefereesByReportedFouls[i]);

            const combinedRefereeName = `${refereeName} ${refereeLastname}`;
            if (!(combinedRefereeName in totalMatchesByReferee)) {
                totalFoulsByReferee[combinedRefereeName] = 0;
                totalMatchesByReferee[combinedRefereeName] = 0;
            }

            totalFoulsByReferee[combinedRefereeName] += refereeFouls.length;
            totalMatchesByReferee[combinedRefereeName]++;
        }

        for (let referee in totalFoulsByReferee) {
            let [refereeName, refereeLastname] = referee.split(' ');
            results.push({
                Vards: refereeName,
                Uzvards: refereeLastname,
                VidejieSodiMaca: totalFoulsByReferee[referee] / totalMatchesByReferee[referee],
                KopejieSodi: totalFoulsByReferee[referee]
            });
        }

        // Sakārto iegūto sarakstu pēc mačā vidēji piešķirtajiem sodiem (dilstošā secībā).
        // Ja ir vienādi vidējie sodi mačā, tad sakārto pēc kopā iegūtajiem sodiem (dilstošā secībā).
        results.sort((prevRef, nextRef) => nextRef.VidejieSodiMaca - prevRef.VidejieSodiMaca || nextRef.KopejieSodi - prevRef.KopejieSodi);

        return results;
    }
)


export const LFLTopGoalScorers = derived(
    LFLMatches,
    $LFLMatches => aggregatePlayersOfTeamsByScoredGoals($LFLMatches) ?? {}
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
import { browser } from "$app/environment";
import { writable, get, derived } from 'svelte/store';

import { parseArrayOfJsonStrings, parseArrayOrObjectDataByKeys } from "$helpers/generators";
import { parseUploadedMatchData, parseGoalScoringInfoForTeam } from "$helpers/tournamentData";

const key = "LFLData";

function mergeUploadedStoredLFLData(parsedUploadData) {
    let uploadDataUnpackedByMatchProperty = parsedUploadData.map(matchData => matchData.Spele);
    let parsedMatchData = [...parseUploadedMatchData(uploadDataUnpackedByMatchProperty)];
    
    const storedLFLData = localStorage.getItem(key);
    if (storedLFLData != null) {
        // Ja localStorage jau ir saglabāti dati, tos apvieno un savā starpā pārbauda:
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
                localStorage.removeItem(key);
            } else {
                valueToStore = parseArrayOfJsonStrings(value);
                if (valueToStore.length > 0) {
                    valueToStore = mergeUploadedStoredLFLData(valueToStore);
                }
            }

            set(valueToStore);
        },
    };
};

function getLFLMatchesData($LFLData) {
    let result = $LFLData;

    if ($LFLData.length > 0 === false) {
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
    $LFLMatches => $LFLMatches.map(matchData => matchData.Komanda)
);

// Saraksts ar visiem sodiem katrā mačā
export const LFLFoulsByMatches = derived(
    LFLTeamsByMatches,
    $LFLTeamsByMatches => {
        return $LFLTeamsByMatches.map(teamsOfMatch => {
            let result = teamsOfMatch.reduce((finalFouls, teamData) => {
                const teamName = teamData.Nosaukums;
                let teamFouls = teamData.Sodi;
                
                if (teamFouls !== "") {
                    const teamFoulsInner = teamFouls.Sods;
                    if (teamFoulsInner.constructor.name == "Array") {
                        teamFoulsInner.forEach(foul => {
                            finalFouls.push({
                                ...foul,
                                Nosaukums: teamName
                            });
                        });
                    } else if (teamFoulsInner.constructor.name == "Object") {
                        finalFouls.push({...teamFoulsInner, Nosaukums: teamName});
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
    $LFLMatches => $LFLMatches.map(matchData => matchData.VT)
);

// Kad visu maču sodu un vecāko tiesnešu saraksti tiek atjaunināti, tad atkal atjauno apvienoto sarakstu,
// kur katrs ieraksts ir objekts, kas satur informāciju par i-tā mača vecāko tiesnesi un viņa piešķirtajiem sodiem i-tā mača laikā
export const LFLRefereesByReportedFouls = derived(
    [LFLFoulsByMatches, LFLRefereesByMatches],
    ([$LFLFoulsByMatches, $LFLRefereesByMatches]) => {
        let refereesByReportedFoulsMap = $LFLRefereesByMatches.reduce((acc, referee, index) => {
            let foulsForRefereeInMatch = $LFLFoulsByMatches[index];

            let result = {
                ...referee,
                Sodi: foulsForRefereeInMatch
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
);

// Visi spēlētāji sadalīti pa komandām
export const LFLPlayersInTeams = derived(
    LFLTeamsByMatches,
    $LFLTeamsByMatches => {
        let teamFullRosterMap = {};

        // Iet cauri visām komandām, apvieno kopā katras komandas datus un tos saglabā vienā vārdnīcā "teamFullRosterMap":
        for (let matchTeams of $LFLTeamsByMatches) {
            for (let teamData of matchTeams) {
                const teamName = teamData.Nosaukums;
                const teamGoalsInMatch = parseGoalScoringInfoForTeam(teamData.Varti?.VG);
                const teamSubstitutions = parseArrayOrObjectDataByKeys(teamData.Mainas?.Maina);
                const teamFouls = parseArrayOrObjectDataByKeys(teamData.Sodi?.Sods);
                
                if (!(teamName in teamFullRosterMap)) {
                    teamFullRosterMap[teamName] = {
                        Mainas: teamSubstitutions,
                        Sodi: teamFouls,
                        Speletaji: [...teamData.Speletaji.Speletajs],
                        Varti: [...teamGoalsInMatch]
                    };
                } else {
                    teamFullRosterMap[teamName].Mainas  = [...teamFullRosterMap[teamName].Mainas, ...teamSubstitutions];
                    teamFullRosterMap[teamName].Sodi    = [...teamFullRosterMap[teamName].Sodi, ...teamFouls];
                    teamFullRosterMap[teamName].Varti   = [...teamFullRosterMap[teamName].Varti, ...teamGoalsInMatch]
                }
            }
        }

        return teamFullRosterMap;
    }
);

// Saraksts ar LFL līgas spēlētājiem visos mačos, sakārtots pēc kopējiem iesistajiem vārtiem pa visiem mačiem:
export const LFLTopGoalScorers = derived(
    LFLPlayersInTeams,
    $LFLPlayersInTeams => {
        let teamFullRosterMap = {...$LFLPlayersInTeams};
        let playersByGoalsAndTeams = [];

        // Iet cauri katrai komandai vārdnīcā, katram spēlētājam pievieno klāt kopā iesisto golu un izdarīto rezultatīvo piespēļu skaitu:
        for (let team in teamFullRosterMap) {
            let teamData = teamFullRosterMap[team];
            let teamFullRoster = teamData.Speletaji;
            let teamTotalGoals = teamData.Varti;

            teamFullRoster.forEach((player, i) => {
                const playerJerseyNumber = player.Nr;
                let totalGoalsScored = player.KopejieIesistieVarti || 0;
                let totalAssists = player.KopejasRezultativasPiespeles || 0;

                for (const goal of teamTotalGoals) {
                    const goalScorer = goal.VartuGuvejs;
                    const assistedBy = goal.RezultativiPiespeleja;

                    if (playerJerseyNumber === goalScorer) {
                        totalGoalsScored++;
                    }

                    if (assistedBy.includes(playerJerseyNumber)) {
                        totalAssists++;
                    }
                }

                teamData.Speletaji[i] = {
                    ...player,
                    Komanda: team,
                    KopejieIesistieVarti: totalGoalsScored,
                    KopejasRezultativasPiespeles: totalAssists
                }

                // Katras komandas atjaunināto beigu sastāvu saglabā sarakstā:
                playersByGoalsAndTeams.push({...teamData.Speletaji[i]});
            });
        }

        // Tālāk sakārto iegūto spēlētāju sarakstu pēc kopējiem iesistajiem vārtiem dilstošā secībā
        // Ja diviem spēlētājiem ir vienāds iesisto vārtu skaits, tad kārto pēc kopējām rezultatīvajām piespēlēm:
        playersByGoalsAndTeams.sort((prevPlayer, nextPlayer) => {
            return nextPlayer.KopejieIesistieVarti - prevPlayer.KopejieIesistieVarti || 
                   nextPlayer.KopejasRezultativasPiespeles - prevPlayer.KopejasRezultativasPiespeles;
        });

        return playersByGoalsAndTeams;
    }
);

// Saraksts ar visiem LFL spēlētājiem visos LFL mačos, sakārtots pēc kopā nopelnītajiem sodiem:
export const LFLPlayersByBookings = derived(
    [LFLPlayersInTeams, LFLFoulsByMatches],
    ([$LFLPlayersInTeams, $LFLFoulsByMatches]) => {
        let teamFullRosterMap = {...$LFLPlayersInTeams};
        let totalFoulsByMatches = [...$LFLFoulsByMatches];

        let playersByBookingsAndTeams = [];

        for (let team in teamFullRosterMap) {
            let teamData = teamFullRosterMap[team];
            let teamFullRoster = teamData.Speletaji;
            // let teamTotalFouls = teamData.Sodi;

            teamFullRoster.forEach((player, i) => {
                const playerJerseyNumber = player.Nr;
                let totalPlayerFouls = player.KopejieSodi || 0;
                let totalPlayerYellowCards = player.DzeltenasKartinas || 0;
                let totalPlayerRedCards = player.SarkanasKartinas || 0;

                totalFoulsByMatches.forEach((foulsInMatch, i) => {
                    let playerFoulsInMatch = 0;

                    let result = foulsInMatch.filter((foulData) => foulData.Nosaukums === team);

                    for (const foul of result){
                        const bookedPlayerNumber = foul.Nr;
                        if (playerJerseyNumber === bookedPlayerNumber) {
                            totalPlayerFouls++;
                            playerFoulsInMatch++;
                        }
                    }

                    // Katrā mačā, kur ir viens sods, piešķir vienu dzelteno kartiņu
                    // Katrā mačā, kur ir divi sodi, piešķir DIVAS dzeltenās UN VIENU sarkano kartiņu:
                    if (playerFoulsInMatch === 1) {
                        totalPlayerYellowCards++;
                    } 
                    if (playerFoulsInMatch === 2) {
                        totalPlayerYellowCards++;
                        totalPlayerRedCards++;
                    }

                    // console.log(`Speletaja goli mačā nr.${i} un kopā:`, team, playerJerseyNumber, playerFoulsInMatch, totalPlayerFouls, totalPlayerYellowCards, totalPlayerRedCards);
                });

                teamData.Speletaji[i] = {
                    ...player,
                    Komanda: team,
                    KopejieSodi: totalPlayerFouls,
                    DzeltenasKartinas: totalPlayerYellowCards,
                    SarkanasKartinas: totalPlayerRedCards
                };

                // Katras komandas atjaunināto beigu sastāvu saglabā sarakstā:
                playersByBookingsAndTeams.push({...teamData.Speletaji[i]});
            });
        }

        // Tālāk sakārto iegūto spēlētāju sarakstu pēc kopējiem nopelnītajiem sodiem dilstošā secībā.
        // Ja diviem spēlētājiem ir vienāds piešķirto sodu skaits, tad kārto pēc dzelteno kartiņu skaita.
        // Ja sakrīt arī dzelteno kartiņu skaits, tad kārto pēc sarkanā kartiņu skaita:
        playersByBookingsAndTeams.sort((prevPlayer, nextPlayer) => {
            return nextPlayer.KopejieSodi - prevPlayer.KopejieSodi || 
                   nextPlayer.DzeltenasKartinas - prevPlayer.DzeltenasKartinas ||
                   nextPlayer.SarkanasKartinas - prevPlayer.SarkanasKartinas;
        });

        return playersByBookingsAndTeams;
    }
)
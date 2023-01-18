import { parseArrayOrObjectDataByKeys } from "./generators";

/**
 * Aprēķina komandas iegūto punktu skaitu pēc sekojošajiem LFL noteikumiem:
 * "Par uzvaru pamatlaikā komanda saņem PIECUS punktus, 
 *  par uzvaru papildlaikā komanda saņem TRĪS punktus, 
 *  par zaudējumu papildlaikā komanda saņem DIVUS punktus, 
 *  par zaudējumu pamatlaikā komanda saņem VIENU punktu".
 * 
 * @param {*} matchTeamInfo 
 */
export function calculatePointsForTeamInMatch(matchTeamInfo, hasMatchEndedInFullTime) {
    let points = 0;
    let hasTeamWonInFullTime = matchTeamInfo.wonMatchInFullTime;
    let hasTeamWonMatch = matchTeamInfo.wonMatch;

    if (hasTeamWonMatch && hasTeamWonInFullTime && hasMatchEndedInFullTime) {
        points = 5;  // 1. gadījums - komanda uzvarēja pamatlaikā:
    } else if (hasTeamWonMatch && hasTeamWonInFullTime === false && hasMatchEndedInFullTime === false) {
        points = 3;  // 2. gadījums - komanda uzvarēja papildlaikā:
    } else if (hasTeamWonMatch === false && hasTeamWonInFullTime === false && hasMatchEndedInFullTime === false) {
        points = 2;  // 3. gadījums - komanda zaudēja papildlaikā:
    } else if (hasTeamWonMatch === false && hasMatchEndedInFullTime) {
        points = 1;  // 4. gadījums - komanda zaudēja pamatlaikā:
    }

    return points;
}

export function calculateAdditionalStatistics(teamToBeSaved, secondTeam, hasMatchEndedInFullTime) {
    let result = {
        totalPoints: calculatePointsForTeamInMatch(teamToBeSaved, hasMatchEndedInFullTime),
        winsInFullTime: (teamToBeSaved.wonMatch === true && hasMatchEndedInFullTime === true) ? 1 : 0,
        lossesInFullTime: (teamToBeSaved.wonMatch === false && hasMatchEndedInFullTime === true) ? 1 : 0,
        winsInExtraTime: (teamToBeSaved.wonMatch === true && hasMatchEndedInFullTime === false) ? 1 : 0,
        lossesInExtraTime: (teamToBeSaved.wonMatch === false && hasMatchEndedInFullTime === false) ? 1 : 0,
        totalGoalsFor: teamToBeSaved.totalGoalsScored,
        totalGoalsAgainst: secondTeam.totalGoalsScored,
    };

    return result;
}

/**
 * Aprēķina statistiku visām mača komandām
 * 
 * @param {*} teamRanking 
 * @returns - atgriež masīvu, kur katra vērtība ir masīvs, kas sastāv no komandas nosaukuma un tās informācijas
 */
export function calculateStatisticsForMatchTeams(teamRanking) {
    let fullStatisticsByMatch = teamRanking.reduce((acc, matchTeamInfo) => {
        let matchTeamInfoUnpacked = Object.values(matchTeamInfo);
        let firstTeam = matchTeamInfoUnpacked[0],
            secondTeam = matchTeamInfoUnpacked[1],
            hasMatchEndedInFullTime = matchTeamInfoUnpacked[2];

        let result = {
            [firstTeam.teamName]: {
                ...calculateAdditionalStatistics(firstTeam, secondTeam, hasMatchEndedInFullTime)
            },
            [secondTeam.teamName]: {
                ...calculateAdditionalStatistics(secondTeam, firstTeam, hasMatchEndedInFullTime)
            }
        };

        acc.push(result);

        return [...acc];
    }, []);

    // Katru iekšējo lauku sasummē kopā:
    let statisticsForAllMatchesCombined = [...fullStatisticsByMatch].reduce((acc, matchTeamInfo, index) => {
        for (const teamName in matchTeamInfo) {
            if (acc[teamName] === undefined) {
                acc[teamName] = {
                    ...matchTeamInfo[teamName]
                };
            } else {
                acc[teamName].teamName = teamName;
                acc[teamName].totalPoints       = acc[teamName]?.totalPoints       +  matchTeamInfo[teamName].totalPoints,
                acc[teamName].winsInFullTime    = acc[teamName]?.winsInFullTime    +  matchTeamInfo[teamName].winsInFullTime,
                acc[teamName].lossesInFullTime  = acc[teamName]?.lossesInFullTime  +  matchTeamInfo[teamName].lossesInFullTime,
                acc[teamName].winsInExtraTime   = acc[teamName]?.winsInExtraTime   +  matchTeamInfo[teamName].winsInExtraTime,
                acc[teamName].lossesInExtraTime = acc[teamName]?.lossesInExtraTime +  matchTeamInfo[teamName].lossesInExtraTime,
                acc[teamName].totalGoalsFor     = acc[teamName]?.totalGoalsFor     +  matchTeamInfo[teamName].totalGoalsFor,
                acc[teamName].totalGoalsAgainst = acc[teamName]?.totalGoalsAgainst +  matchTeamInfo[teamName].totalGoalsAgainst
            }
        }
        
        return {...acc};
    }, {});

    // Sakārto komandu statistikas datus pēc iegūtajiem punktiem (komanda ar lielāko punktu skaitu būs pirmā):
    let sortedStatisticsByTotalPoints = Object.entries(statisticsForAllMatchesCombined)
            .sort(([, prevTeamData], [, nextTeamData]) => nextTeamData.totalPoints - prevTeamData.totalPoints);

    // Visbeidzot atgriež iegūto sakārtoto tabulu kā masīvu, kur katrs elements ir atbilstošās komandas statistikas datu objekts:
    let teamStatisticsCombined = sortedStatisticsByTotalPoints.map(([, teamData]) => ({...teamData}));

    return [...teamStatisticsCombined];
}

export function isGoalScoredInExtraTime(scoringTime) {
    let time = scoringTime.split(':'),
        minutes = parseInt(time[0]),
        seconds = parseInt(time[1]);

    if (minutes > 60 && seconds > 0) {
        return true;
    }

    return false;
}

export function getWinnerOfMatch(matchTotalGoalCountForEachTeam) {
    let result = {};
    if (matchTotalGoalCountForEachTeam !== undefined) {
        /** @type {Object} */
        result = Object.keys(matchTotalGoalCountForEachTeam)
            .reduce((prev, next) => {
                let prevTeam = matchTotalGoalCountForEachTeam[prev], 
                    nextTeam = matchTotalGoalCountForEachTeam[next];

                // Atgriež to komandu, kurai ir vairāk iesistu vārtu mačā:
                let result = (prevTeam.totalGoalsScored > nextTeam.totalGoalsScored) ? prevTeam : nextTeam;
                
                // Ja komanda iesita papildlaikā, tad atzīmē, ka komanda ir uzvarējusi papildlaikā:
                result.wonMatch = true;
                result.wonMatchInFullTime = result.hasTeamScoredInExtraTime === false;
                
                return result;
            });
    }

    return result;
}

export function parseGoalData(goal) {
    let listOfAssists = goal.P;
    let assists = parseArrayOrObjectDataByKeys(listOfAssists, 'Nr');
    
    assists = assists.filter((val) => val !== undefined);

    return {
        IesistoVartuTips: goal.Sitiens,
        Laiks: goal.Laiks,
        RezultativiPiespeleja: assists,
        VartuGuvejs: goal.Nr
    };
}

export function parseGoalScoringInfoForTeam(teamGoals) {
    let result = [];

    if (teamGoals !== undefined) {
        if (teamGoals.constructor.name == "Array") {
            teamGoals.forEach(goal => {
                result.push({...parseGoalData(goal)});
            });
        } else if (teamGoals.constructor.name == "Object") {
            result.push({...parseGoalData(teamGoals)});
        }
    }

    return result;
}

/**
 * 
 * @param {Object[]} teamGoals
 * @param {String} teamName
 * @returns Object
 */
export function parseTeamGoals(teamGoals, teamName) {
    let teamGoalInfo = {};

    let result = [...parseGoalScoringInfoForTeam(teamGoals)];

    teamGoalInfo = result.reduce((acc, currentValue) => {
        acc.teamName = teamName;
        acc.totalGoalsScored += 1;
        // Ja komanda iesita papildlaikā, tad tā arī uzvarēja maču
        acc.hasTeamScoredInExtraTime = isGoalScoredInExtraTime(currentValue.Laiks);
        return acc;
    }, {
        teamName: teamName,
        totalGoalsScored: 0,
        hasTeamScoredInExtraTime: false,
        wonMatchInFullTime: false,
        wonMatch: false
    });

    return teamGoalInfo;
}

/**
 * Funkcija, kas salīdzina padoto maču ar iepriekš ielādētajiem mačiem pēc sekojošajiem kritērījiem:
 *      1. Ja ielādētā mača datums sakrīt ar kādu no iepriekšējiem mačiem, tad skatās:
 *          1.1. Ja ielādētā mača komandu sarakstā ietilpst kaut viena no iepriekšējā mača komandām, tad 
 *               šo maču atzīmē kā nederīgu un ignorē
 *
 * @param {Object} currentMatch 
 * @param {Object[]} previouslyLoadedMatches 
 * @returns 
 */
export function isCurrentMatchAlreadyLoaded(currentMatch, previouslyLoadedMatches) {
    const currentMatchTeams = currentMatch.Komanda.map(teamData => teamData.Nosaukums);
    const currentMatchTime  = new Date(currentMatch.Laiks).getTime();

    let isMatchAlreadyLoaded = !previouslyLoadedMatches.some(previousMatchData => {
        const previousMatchTime  = new Date(previousMatchData.Laiks).getTime();
        const previousMatchTeams = previousMatchData.Komanda.map(teamData => teamData.Nosaukums);
        
        let shouldMatchBeSkipped = previousMatchTime === currentMatchTime;
        
        if (shouldMatchBeSkipped) {
            shouldMatchBeSkipped = currentMatchTeams.some((teamName) => {
                return previousMatchTeams.includes(teamName);
            });
        }
        
        return shouldMatchBeSkipped;
    });

    return isMatchAlreadyLoaded;
}

/**
 * Pārbauda, vai katrs no augšupielādētajiem mačiem nesakrīt ar kādu no iepriekš saglabātiem vai augšupielādētiem mačiem.
 * 
 * @param {Object[]} uploadedMatchData - augšupielādētie mači
 * @param {Object[]} storedMatchData   - visi iepriekš saglabātie mači, ja tādi ir (ja nav, pie katra augšupielādētā mača skatās tos, kas atrodas pirms tā)
 * @returns 
 */
export function validateNewMatchData(uploadedMatchData, storedMatchData = []) {
    let result = uploadedMatchData.filter((currentMatchData, currentIndex, unpackedData) => {
        let res = true;

        // Ja ir padoti mači, kas iepriekš ir saglabāti, tad tos izmanto salīdzināšanai.
        // Pretējā gadījumā izmanto visus tos mačus, kas ir pirms tekošā mača:
        let previouslyLoadedMatches = [];

        if (storedMatchData.length > 0) {
            previouslyLoadedMatches = [...storedMatchData];
            res = isCurrentMatchAlreadyLoaded(currentMatchData, previouslyLoadedMatches);
        } else {
            previouslyLoadedMatches = unpackedData.slice(0, currentIndex);

            // Ja nav padoti iepriekš saglabātie mači, tad pirmo vienmēr ielādēs, bet nākošos salīdzinās ar iepriekš ielādētajiem:
            res = (currentIndex === 0) ? true : isCurrentMatchAlreadyLoaded(currentMatchData, unpackedData.slice(0, currentIndex));
        }

        return res;
    });

    return result;
}

/**
 * Funkcija, kas pārbauda katra augšupielādētā mača saturu un to salīdzina ar katru augšupielādēto maču sistēmā.
 * Ja mačs, kas tiek augšupielādēts, ir jau iepriekš izspēlēts (tas ir, ja kāda no augšupielādētā mača komandām),
 * tad šo failu ignorē un iet tālāk pie nākošā.
 * 
 * Rezultātā tiek atgriezts saraksts ar tiem augšupielādētajiem mačiem
 * 
 * @param {Object[]} uploadedLFLData
 * @param {Object[]} previouslyLoadedMatches
 * @returns 
 */
export function parseUploadedMatchData(uploadedLFLData, previouslyLoadedMatches = []) {
    let result = validateNewMatchData(uploadedLFLData, previouslyLoadedMatches);

    return result;
}
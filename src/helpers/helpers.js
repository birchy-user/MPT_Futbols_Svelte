import { initializeEmptyObjectFromColumns } from "./generators";

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

export function testCalcStatistics(teamRanking) {
    console.log("Team ranking final answer: ", teamRanking);

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
                acc[teamName] = {...matchTeamInfo[teamName]};
            } else {
                acc[teamName].ranking = 42;
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

    debugger;

    console.log("Test data par teamRanking:", statisticsForAllMatchesCombined);

    return {...statisticsForAllMatchesCombined};
}

/**
 * Aprēķina statistiku visām mača komandām
 * @param {*} matchTotalGoalCountForEachTeam 
 * @param {*} hasMatchEndedInFullTime 
 */
export function calculateStatisticsForMatchTeams(matchTotalGoalCountForEachTeam, hasMatchEndedInFullTime) {
    let result = {};

    if (matchTotalGoalCountForEachTeam !== undefined) {
        let data = matchTotalGoalCountForEachTeam.map(item => {
            return {...item}; 
        });

        // TODO: Šeit pievienot pārējo statistiku no "tournamentResultsTableColumns" mainīgā:
        result = data.map(info => {
            const totalPoints = info.totalPoints ?? 0;

            return {...info, totalPoints: totalPoints + calculatePointsForTeamInMatch(info, hasMatchEndedInFullTime)}
        });

        // data.forEach(info => {
        //     console.dir("Tekosais info:", info);
        //     let newInfo = {...info};

        //     result[newInfo.teamName] = {
        //         ...newInfo, 
        //         totalPoints: calculatePointsForTeamInMatch(newInfo)
        //     };
        // });
    
        // for (const team in data) {
        //     result[team] = Object.keys(data).reduce((acc, teamName) => {
        //         console.dir("Tekosais acc: ", acc);
        //         acc.totalPoints = acc.totalPoints + calculatePointsForTeamInMatch(data[teamName]);
        //         return acc;
        //     }, {
        //         ...data[team],
        //         totalPoints: 0
        //     });
        // }

        console.dir("Tekosais result par visām komandām mačā:", result);

    }

    return {...result};
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
    let result = false;
    if (matchTotalGoalCountForEachTeam !== undefined) {
        /** @type {Object} */
        let winnerOfMatch = Object.keys(matchTotalGoalCountForEachTeam)
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

        result = winnerOfMatch.wonMatchInFullTime;
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
    let result = [];
    let teamGoalInfo = {};
    let matchGoalTimes = [];

    if (teamGoals !== undefined) {
        if (teamGoals.constructor.name == "Array") {
            teamGoals.forEach(goal => {
                result.push({
                    teamName: teamName,
                    teamScoringTime: goal.Laiks,
                    teamScorerNumber: goal.Nr,
                    teamGoalType: goal.Sitiens
                });
            });
        } else if (teamGoals.constructor.name == "Object") {
            result.push({
                teamName: teamName,
                teamScoringTime: teamGoals.Laiks,
                teamScorerNumber: teamGoals.Nr,
                teamGoalType: teamGoals.Sitiens
            });
        }
    }

    teamGoalInfo = result.reduce((acc, currentValue) => {
        acc.teamName = teamName;
        acc.totalGoalsScored += 1;
        // Ja komanda iesita papildlaikā, tad tā arī uzvarēja maču
        acc.hasTeamScoredInExtraTime = isGoalScoredInExtraTime(currentValue.teamScoringTime);
        return acc;
    }, {
        teamName: teamName,
        totalGoalsScored: 0,
        hasTeamScoredInExtraTime: false,
        wonMatchInFullTime: false,
        wonMatch: false
    });

    return [result, {...teamGoalInfo}];

}
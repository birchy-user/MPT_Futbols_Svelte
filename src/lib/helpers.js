export function calculatePointsForTeam() {

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

export function parseScoredGoalCount(matchTotalGoalCountForEachTeam) {
    let result = {};
    if (matchTotalGoalCountForEachTeam !== undefined) {
        result = Object.keys(matchTotalGoalCountForEachTeam)
            .reduce((prev, next) => {
                let result = (matchTotalGoalCountForEachTeam[prev].totalGoalsScored > matchTotalGoalCountForEachTeam[next].totalGoalsScored) 
                    ? matchTotalGoalCountForEachTeam[prev] : matchTotalGoalCountForEachTeam[next];
                
                result.wonMatch = true;
                
                return result;
            });
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

    if (teamGoals !== undefined) {
        let totalGoalsScoredByCurrentTeam = 0;

        if (teamGoals.constructor.name == "Array") {
            teamGoals.forEach(goal => {
                totalGoalsScoredByCurrentTeam = teamGoalInfo[teamName]?.totalGoalsScored || 0;

                result.push({
                    teamName: teamName,
                    teamScoringTime: goal.Laiks,
                    teamScorerNumber: goal.Nr,
                    teamGoalType: goal.Sitiens
                });
            });
        } else if (teamGoals.constructor.name == "Object") {
            totalGoalsScoredByCurrentTeam = teamGoalInfo[teamName]?.totalGoalsScored || 0;
    
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
        acc.hasTeamScoredInExtraTime = isGoalScoredInExtraTime(currentValue.teamScoringTime);
        return acc;
    }, {
        teamName: teamName,
        totalGoalsScored: 0,
        hasTeamScoredInExtraTime: false,
        wonMatch: false
    });

    return [result, teamGoalInfo];

}
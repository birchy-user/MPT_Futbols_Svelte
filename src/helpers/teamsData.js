export function getFinalRosterOfTeam(team) {
    const teamMainRoster = team.Pamatsastavs;
    const teamPlayers = team.Speletaji;
    const teamSubstitutions = team.Mainas || {};

    return {
        Speletaji: teamPlayers,
        Pamatsastavs: teamMainRoster,
        Mainas: teamSubstitutions,
    }
}

/**
 * 
 * @param {Object} teams 
 */
export function getPlayersAtMatchEndForTeams(teams) {
    let result = {};

    for (const team in teams) {
        result[team.Nosaukums] = {...getFinalRosterOfTeam(team)};
    }

    return result;
}

export function getTeamsFromMatches(listOfMatches) {
    let result = [...listOfMatches].reduce((acc, matchData) => {
        let match = matchData.Spele;
        let matchDate = new Date(match.Laiks);
        let matchTeamInfoUnpacked = Object.values(match.Komanda);
        let firstTeam = matchTeamInfoUnpacked[0], 
            secondTeam = matchTeamInfoUnpacked[1];
    
        let result = {
            Laiks: matchDate.getTime(),
            Komandas: {
                [firstTeam.Nosaukums]: {
                    Pamatsastavs: firstTeam.Pamatsastavs,
                    Mainas: firstTeam.Mainas,
                    Speletaji: firstTeam.Speletaji
                },
                [secondTeam.Nosaukums]: {
                    Pamatsastavs: secondTeam.Pamatsastavs,
                    Mainas: secondTeam.Mainas,
                    Speletaji: secondTeam.Speletaji
                }
            }
        };
    
        acc.push(result);
        
        return [...acc];
    }, []);

    return result;
}

export function aggregateMatchesByTimeAndParticipatingTeams(listOfMatches) {
    let aggregateResult = getTeamsFromMatches(listOfMatches);

    let moreTest = aggregateResult.filter((currentMatch, i, newTest) => {
        if (i === 0) { 
            return true;
        }
        
        const prevMatch = newTest[i-1];
        const prevMatchTime = prevMatch.Laiks;
    
        const currentMatchTime = currentMatch.Laiks;
    
        const prevMatchTeams = Object.keys(prevMatch.Komandas);
        const currentMatchTeams = Object.keys(currentMatch.Komandas);
    
        console.log("Tekošā komanda | iepriekšējā komanda");
        console.log(prevMatchTeams, currentMatchTeams);
        console.log(prevMatchTime, currentMatchTime);
    
        let comparisonResult = prevMatchTime === currentMatchTime;
    
        if (comparisonResult) {
            currentMatchTeams.every((teamName, i) => {
                if (prevMatchTeams.includes(teamName)) {
                    return false;
                }
    
                return true;
            });
        }
        
    
        return comparisonResult;
    });

    let result = [...listOfMatches];

    return result;
}
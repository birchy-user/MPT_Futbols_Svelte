
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
            Komandas: [firstTeam.Nosaukums, secondTeam.Nosaukums]
            // Komandas: {
            //     [firstTeam.Nosaukums]: {
            //         Pamatsastavs: firstTeam.Pamatsastavs,
            //         Mainas: firstTeam.Mainas,
            //         Speletaji: firstTeam.Speletaji
            //     },
            //     [secondTeam.Nosaukums]: {
            //         Pamatsastavs: secondTeam.Pamatsastavs,
            //         Mainas: secondTeam.Mainas,
            //         Speletaji: secondTeam.Speletaji
            //     }
            // }
        };
    
        acc.push(result);
        
        return [...acc];
    }, []);

    return result;
}
import { parseGoalScoringInfoForTeam } from "$helpers/tournamentData";

// import { playerMapByGoals } from "src/structures/playerMap";

/**
 * Funkcija, kas atgriež sarakstu ar komandām un to spēlētājiem, kas iesituši vārtus
 */
export function aggregatePlayersOfTeamsByScoredGoals(matches) {
    console.log("Matches data when aggregating topScorers:", matches);

    let matchTeamsGoalsAndPlayers = matches.map((matchData) => {
        const matchTeams = matchData.Komanda;

        let data = {};

        matchTeams.forEach((team) => {
            data[team.Nosaukums] = {
                IesistieVarti: parseGoalScoringInfoForTeam(team.Varti.VG, team.Nosaukums),
                Speletaji: team.Speletaji.Speletajs
            }
        });

        return data;
    });

    let matchPlayersWithGoalsScored = matchTeamsGoalsAndPlayers.map((matchData) => {
        let data = {};

        const teamNames = Object.keys(matchData);

        const firstTeamName = teamNames[0],
            firstTeam = matchData[firstTeamName],
            firstTeamPlayers = firstTeam.Speletaji;

        // debugger;

        let firstTeamGoalsScored = firstTeam.IesistieVarti.reduce((acc, goalInfo) => {
            acc = {
                Laiks: goalInfo.teamScoringTime,
                VartuGuvejs: goalInfo.teamScorerNumber,
                RezultativiPiespeleja: goalInfo.teamAssistedBy,
                IesistoVartuTips: goalInfo.teamGoalType
            };

            return acc;
        }, {});

        // console.log("Tekošās pirmās komandas iesisto vārtu dati:", firstTeamGoalsScored);
        
        const secondTeamName = teamNames[1],
            secondTeam = matchData[secondTeamName],
            secondTeamPlayers = secondTeam.Speletaji;

        let secondTeamGoalsScored = secondTeam.IesistieVarti.reduce((acc, goalInfo) => {
            acc = {
                Laiks: goalInfo.teamScoringTime,
                VartuGuvejs: goalInfo.teamScorerNumber,
                RezultativiPiespeleja: goalInfo.teamAssistedBy,
                IesistoVartuTips: goalInfo.teamGoalType
            };

            return acc;
        }, {});

        // console.log("Tekošās otrās komandas iesisto vārtu dati:", secondTeamGoalsScored);


        data = {
            [firstTeamName]: {
                Speletaji: firstTeamPlayers,
                IesistieVarti: firstTeamGoalsScored
            },
            [secondTeamName]: {
                Speletaji: secondTeamPlayers,
                IesistieVarti: secondTeamGoalsScored
            }
        };

        // const playersWithGoalsScored = matchData.Speletaji.map((player) => {

        // });
        
        return data;
    });

    return matchPlayersWithGoalsScored;
}
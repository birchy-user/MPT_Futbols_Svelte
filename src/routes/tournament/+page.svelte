<script>
    import { onMount } from "svelte";

	import { calculateStatisticsForMatchTeams, getWinnerOfMatch, parseTeamGoals } from "$helpers/tournamentData";
    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import Spinner from "$components/loader/Spinner.svelte";
	import PageTitle from "$components/PageTitle.svelte";
	import Table from "$components/Table.svelte";

    import { LFLData } from "$lib/stores";
	import { getParsedJsonData } from "$helpers/generators";

    const title = 'LFL līgas turnīra statistika';
    const breadcrumbs = [
        {
            href: '/',
            label: 'Sākums'
        },
        {
            label: 'Turnīra statistika'
        }
    ];

    const tournamentResultsTableParams = {
        teamName: "Komanda",
        totalPoints: "Punkti",
        winsInFullTime: "Uzv.",
        lossesInFullTime: "Zaud.",
        winsInExtraTime: "Uzv. p.l.",
        lossesInExtraTime: "Zaud. p.l.",
        totalGoalsFor: "Gūtie vārti",
        totalGoalsAgainst: "Zaudētie vārti"
    };

    let matchesJsonData = [];
    let tournamentData = [];


    function parseMatchData() {
        // Lauki, kuros glabās informāciju par katru komandu
        let teamRanking = [];

        let topScorerPlayerData = [];

        matchesJsonData.forEach((match, i) => {
            const matchData = match.Spele;
            const matchTeams = matchData.Komanda; 
            const matchReferees = matchData.T;
            const matchMainReferee = matchData.VT;
            const matchVisitorsCount = matchData.Skatitaji;
            const matchLocation = matchData.Vieta;

            console.log(`Match data for match nr.${i+1}`, matchData);

            // Komandas statistikas dati
            let matchTotalGoalCountForEachTeam = [];
            let matchTeamGoalStatistics = [];
            let teamStatisticsForMatch = {};

            // Dati par spēlētājiem, kas piedalījās mačā:
            let playerData = {};

            console.log();

            matchTeams.forEach((team, i) => {
                console.log(`TEAM DATA for match nr.${i+1}:`, team);
                const teamName = team.Nosaukums;
                const teamMainRoster = team.Pamatsastavs;
                const teamPlayers = team.Speletaji;

                // Lauki, kas var būt tukši katrai komandai (vārti, sodi, maiņas):
                const teamGoals = team.Varti || {};
                const teamFouls = team.Sodi || {};
                const teamSubstitutions = team.Mainas || {};

                let [teamGoalStatistics, teamGoalInfo] = parseTeamGoals(teamGoals.VG, teamName);
                matchTeamGoalStatistics.push(teamGoalStatistics);
                matchTotalGoalCountForEachTeam.push(teamGoalInfo);

                teamStatisticsForMatch[teamName] = teamGoalInfo;

                /**
                 * TODO:
                 * 1. Saglabāt katras komandas sastāvu mača beigās: 
                 *    teamRosterAfterMatchEnd = merge(teamMainRoster, teamSubstitutions)
                 * 
                 * 2. Iet cauri iesistajiem vārtiem (teamGoalStatistics) un zem "playerData[teamName]"
                 *    saglabāt šādu objektu:
                 *    
                 *    playerData[teamName] = {
                 *          <index> (katram index no 0 līdz teamRosterAfterMatchEnd.length ir objekts): {
                 *              player: {
                 *                  number: <speletaja_numurs>,
                 *                  goalsScored: <iesistie vārti>
                 *              }
                 *          }
                 *    }
                 */

                // Saglabā spēlētājus no katras komandas:
                playerData[teamName] = {
                    IesistieVarti: teamGoalStatistics,
                    PamatSastavs: {...teamMainRoster},
                    Speletaji: {...teamPlayers}
                };
            });

            console.log();

            // console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");
            // console.dir("Goals scored by each team:", matchTeamGoalStatistics);
            // console.dir("matchTotalGoalCountForEachTeam DATA AFTER EACH TEAM IS PROCESSED FOR MATCH:", matchTotalGoalCountForEachTeam);
            // console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");
            
            // Iet cauri visiem goliem katrai komandai, saskaita kopā iegūto un skatās, vai pēdējais iesistais gols ir bijis pamatlaikā vai papildlaikā:
            let winnerOfMatch = getWinnerOfMatch(matchTotalGoalCountForEachTeam);
            teamStatisticsForMatch['hasMatchEndedInFullTime'] = winnerOfMatch.wonMatchInFullTime;

            // console.dir("teamStatisticsForMatch after adding hasMatchEndedInFullTime:", teamStatisticsForMatch);


            // Aprēķina katras komandas vietu reitingu tabulā:
            teamRanking.push(teamStatisticsForMatch);

            console.dir(`Player data for match nr.${i + 1}: `, playerData);
            console.log();
        });

        tournamentData = calculateStatisticsForMatchTeams(teamRanking);

        console.log("Total ranking:", tournamentData);
    };

    onMount(() => {
        matchesJsonData = LFLData.getData();
        parseMatchData();
    })

</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<div class="flex flex-col w-screen min-h-screen py-10">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden sm:rounded-lg">
            {#if matchesJsonData.length > 0 === false} 
                <div class="bg-gray-800">
                    <Spinner classes="" />
                </div>
            {:else}
                <Table 
                    tableParams={tournamentResultsTableParams}
                    tableData={tournamentData}
                />
            {/if}
        </div>
    </div>
</div>
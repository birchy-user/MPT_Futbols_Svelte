<script>
    import { onMount } from "svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import Spinner from "$components/loader/Spinner.svelte";
	import PageTitle from "$components/PageTitle.svelte";
	import Table from "$components/Table.svelte";

    import { LFLMatches } from "$lib/stores";
	import { calculateStatisticsForMatchTeams, getWinnerOfMatch, parseTeamGoals } from "$helpers/tournamentData";

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

        matchesJsonData.forEach((matchData, i) => {
            const matchTeams = matchData.Komanda; 

            // Komandas statistikas dati
            let matchTotalGoalCountForEachTeam = [];
            let matchTeamGoalStatistics = [];
            let teamStatisticsForMatch = {};

            console.log();

            matchTeams.forEach((team) => {
                const teamName = team.Nosaukums;

                // Vārti, kas var būt tukši katrai komandai:
                const teamGoals = team.Varti || {};

                let [teamGoalStatistics, teamGoalInfo] = parseTeamGoals(teamGoals.VG, teamName);
                matchTeamGoalStatistics.push(teamGoalStatistics);
                matchTotalGoalCountForEachTeam.push(teamGoalInfo);

                teamStatisticsForMatch[teamName] = teamGoalInfo;
            });

            // Iet cauri visiem goliem katrai komandai, saskaita kopā iegūto un skatās, vai pēdējais iesistais gols ir bijis pamatlaikā vai papildlaikā:
            let winnerOfMatch = getWinnerOfMatch(matchTotalGoalCountForEachTeam);
            teamStatisticsForMatch['hasMatchEndedInFullTime'] = winnerOfMatch.wonMatchInFullTime;

            // Aprēķina katras komandas vietu reitingu tabulā:
            teamRanking.push(teamStatisticsForMatch);
        });

        tournamentData = calculateStatisticsForMatchTeams(teamRanking);

        // console.log("Total ranking:", tournamentData);
    };

    onMount(() => {
        matchesJsonData = [...$LFLMatches];
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
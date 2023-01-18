<script>
    import { onMount } from "svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";
	import Table from "$components/Table.svelte";

    import { LFLMatches } from "$lib/stores";
	import { calculateStatisticsForMatchTeams, getWinnerOfMatch, parseTeamGoals } from "$helpers/tournamentData";

    const title = 'LFL līgas turnīra statistika';
    const loadingText = "Nav datu";
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
            let teamStatisticsForMatch = {};

            matchTeams.forEach((team) => {
                const teamName = team.Nosaukums;

                // Vārti, kas var būt tukši katrai komandai:
                const teamGoals = team.Varti || {};

                let teamGoalInfo = parseTeamGoals(teamGoals.VG, teamName);
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
    };

    onMount(() => {
        matchesJsonData = [...$LFLMatches];
        parseMatchData();
    })

</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<Table 
    tableParams={tournamentResultsTableParams}
    tableData={tournamentData}
    {loadingText}
/>
<script>
	import { parseScoredGoalCount, parseTeamGoals } from "$lib/helpers";
    import { onMount } from "svelte";

    export let data;

    const firstRoundMatches = import.meta.glob("../lib/XML_TestData/XMLFirstRound/*.xml");
    const secondRoundMatches = import.meta.glob("../lib/XML_TestData/XMLSecondRound/*.xml");

    const tournamentResultsTableParams = {
        ranking: "Vieta pēc kārtas",
        teamName: "Komandas nosaukums",
        totalPoints: "Kopā iegūtie punkti",
        winsInFullTime: "Uzvaru skaits pamatlaikā",
        lossesInFullTime: "Zaudējumu skaits pamatlaikā",
        winsInExtraTime: "Uzvaru skaits papildlaikā",
        lossesInExtraTime: "Zaudējumu skaits papildlaikā",
        totalGoalsFor: "Spēlēs gūto vārtu skaits",
        totalGoalsAgainst: "Spēlēs zaudēto vārtu skaits"
    };

    const tournamentResultsTableColumns = Object.keys(tournamentResultsTableParams);

    let matchesXMLData = [];
    let matchesJsonData = [];

    let tournamentData = [];

    /** @type {Array.<string>} */
    let matchesXmlFileNames = [];

    let promise = Promise.resolve([]);

    async function loadMatches() {
        matchesXmlFileNames.forEach(matchFile => {
            matchesXMLData.push(
                fetch(matchFile)
                    .then(res => res.text())
                    .then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
                    .then(data => data.getElementsByTagName("Spele")[0])
            );
        });

        Promise.all(matchesXMLData)
            .then(matches => console.log(matches));
    }

    function getMatchesXMLData(matchesData) {
        for (const match in matchesData) {
            matchesData[match]().then(({default: matchFileName}) => {
                matchesXmlFileNames.push(matchFileName);
            });
        }
    };

    function loadMatchesXMLData() {
        getMatchesXMLData(firstRoundMatches);
        getMatchesXMLData(secondRoundMatches);
    }

    function parseMatchData() {
        // Lauki, kuros glabās informāciju par katru komandu
        let teamRanking = {};


        matchesJsonData.forEach((match, i) => {
            const matchData = match.Spele;
            const matchTeams = matchData.Komanda; 
            const matchReferees = matchData.T;
            const matchMainReferee = matchData.VT;
            const matchVisitorsCount = matchData.Skatitaji;
            const matchLocation = matchData.Vieta;

            console.log("---------------------------------");
            // console.log("Match teams:", matchTeams);
            // console.log("Match referees:", matchReferees);
            // console.log("Match mainReferee:", matchMainReferee);
            // console.log("Match visitor count:", matchVisitorsCount);
            // console.log("Match location:", matchLocation);
            console.log();

            let matchTotalGoalCountForEachTeam = {};
            let matchTeamGoalStatistics = [];


            matchTeams.forEach(team => {
                console.log(`TEAM DATA for match nr.${i+1}:`);
                const teamName = team.Nosaukums;
                const teamMainRoster = team.Pamatsastavs;
                const teamPlayers = team.Speletaji;

                // Lauki, kas var būt tukši katrai komandai (vārti, sodi, maiņas):
                const teamGoals = team.Varti || {};
                const teamFouls = team.Sodi || {};
                const teamSubstitutions = team.Mainas || {};

                // console.log("Nosaukums: ", teamName);
                // console.log("Pamatsastavs: ", teamMainRoster);
                // console.log("Speletaji: ", teamPlayers);
                // console.log("Varti: ", teamGoals);
                // console.log("Sodi: ", teamFouls);
                // console.log("Mainas: ", teamSubstitutions);


                console.log(";;;;;;;;;;;;;;;;;;;;;;;;;");
                console.log(`Vārtu guvumi komandai ${teamName} mačā:`, teamGoals.VG);

                let [teamGoalStatistics, teamGoalInfo] = parseTeamGoals(teamGoals.VG, teamName);
                matchTeamGoalStatistics.push(teamGoalStatistics);
                matchTotalGoalCountForEachTeam[teamName] = teamGoalInfo;

                console.log(";;;;;;;;;;;;;;;;;;;;;;;;;");

                console.log("+++++++++++++++++++++++++");
            });

            console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");
            console.log("Goals scored by each team:");
            console.log(matchTeamGoalStatistics);
            console.log(matchTotalGoalCountForEachTeam);
            
            // Iet cauri visiem goliem katrai komandai, saskaita kopā iegūto un skatās, vai pēdējais iesistais gols ir bijis pamatlaikā vai papildlaikā:
            let matchGoalDistribution = parseScoredGoalCount(matchTotalGoalCountForEachTeam);
            console.log("Team that won in this game:", matchGoalDistribution);
            console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");

            // Aprēķina katras komandas vietu reitingu tabulā:
            // let rating = calculatePointsForTeam();
        });

        console.log("Total ranking:", teamRanking);
    };

    onMount(async() => {
        loadMatchesXMLData();
        
        console.log(matchesXmlFileNames);

        const { matchesJson } = data;
        matchesJsonData = matchesJson;

        console.log("Data from loading JSON files:", matchesJsonData);

        parseMatchData();
    });

</script>

<button on:click={loadMatches}>
    Ielādēt spēļu datus
</button>

<div class="relative">
    <table class="w-full">
        {#if matchesJsonData.length > 0}
            <thead>
                <tr>
                    {#each tournamentResultsTableColumns as column}
                        <th>
                            <div class="flex items-center gap-2">
                                <span>{tournamentResultsTableParams[column]}</span>
                            </div>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each matchesJsonData ?? [] as match, i}
                    <tr>
                        <td>Skatitaji mačam starp {match.Spele.Komanda[0].Nosaukums} un {match.Spele.Komanda[1].Nosaukums}: {match.Spele.Skatitaji}</td>
                    </tr>
                {/each}
            </tbody>
        {/if}
    </table>
</div>

<style lang="scss" global>
    @import "../assets/main";
</style>
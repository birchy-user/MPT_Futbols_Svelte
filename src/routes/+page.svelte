<script>
	import { calculateStatisticsForMatchTeams, getWinnerOfMatch, parseTeamGoals, testCalcStatistics } from "$helpers/helpers";
    import { onMount } from "svelte";

    export let data;

    // const firstRoundMatches = import.meta.glob("../lib/XML_TestData/XMLFirstRound/*.xml");
    // const secondRoundMatches = import.meta.glob("../lib/XML_TestData/XMLSecondRound/*.xml");

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
        // let teamRanking = {};
        let teamRanking = [];

        matchesJsonData.forEach((match, i) => {
            const matchData = match.Spele;
            const matchTeams = matchData.Komanda; 
            const matchReferees = matchData.T;
            const matchMainReferee = matchData.VT;
            const matchVisitorsCount = matchData.Skatitaji;
            const matchLocation = matchData.Vieta;

            console.log("---------------------------------");
            console.log();

            let matchTotalGoalCountForEachTeam = [];
            let matchTeamGoalStatistics = [];

            let testCopyData = {};

            matchTeams.forEach((team, i) => {
                console.log(`TEAM DATA for match nr.${i+1}:`);
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

                testCopyData[teamName] = teamGoalInfo;

                // Pievieno pašreizējo komandu pie kopējā komandu reitinga:
                // teamRanking[teamName] = {};
                // teamRanking[teamName] = {...calculateStatisticsForTeam(teamGoalInfo)};

                // teamRanking.push(teamGoalInfo);
            });

            console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");
            console.dir("Goals scored by each team:", matchTeamGoalStatistics);
            console.dir("matchTotalGoalCountForEachTeam DATA AFTER EACH TEAM IS PROCESSED FOR MATCH:", matchTotalGoalCountForEachTeam);
            
            // Iet cauri visiem goliem katrai komandai, saskaita kopā iegūto un skatās, vai pēdējais iesistais gols ir bijis pamatlaikā vai papildlaikā:
            let hasMatchEndedInFullTime = getWinnerOfMatch(matchTotalGoalCountForEachTeam);
            console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");

            testCopyData['hasMatchEndedInFullTime'] = hasMatchEndedInFullTime;

            console.dir("Test copy data by adding hasMatchEndedInFullTime:", testCopyData);


            // Aprēķina katras komandas vietu reitingu tabulā:
            // teamRanking[i] = calculateStatisticsForMatchTeams(matchTotalGoalCountForEachTeam, hasMatchEndedInFullTime);
            
            teamRanking.push(testCopyData);
        });

        tournamentData = testCalcStatistics(teamRanking);

        console.log("EXPECTED RESULT OF TOTAL POINTS FOR EACH TEAM:");
        console.log('Barcelona: 2 + 1 + 5 + 1 = 9');
        console.log('Skolmeistari: 3 + 5 + 1 + 1 = 10');
        console.log('Veiklie: 5 + 1 + 5 + 5 = 16');
        console.log("Total ranking:", tournamentData);
    };

    async function testRequestToCustomAPI() {
        // const response = await fetch();
    };

    onMount(async() => {
        // loadMatchesXMLData();
        
        console.log(matchesXmlFileNames);

        const { matchesJson } = data;
        matchesJsonData = matchesJson;

        console.log("Data from loading JSON files:", matchesJsonData);

        parseMatchData();
    });

</script>

{#if matchesJsonData.length > 0 === false} 
    <div>
        <span>Ielādē LFL datus...</span>
    </div>
{:else}
    <!-- <button on:click={loadMatches}>
        Ielādēt spēļu datus
    </button> -->

    <button on:click={testRequestToCustomAPI}>
        TEST LOAD DATA
    </button>

    <div class="relative">
        <table class="w-full">
            <thead>
                <tr>
                    {#each tournamentResultsTableColumns as column}
                        <th class="border items-center">
                            <div class="flex items-center gap-2">
                                <span>{tournamentResultsTableParams[column]}</span>
                            </div>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each Object.entries(tournamentData) ?? [] as [teamName, teamData]}
                    <tr>
                        {#each tournamentResultsTableColumns as column}
                            <td class="border">
                                <div class="flex flex-wrap items-center gap-1">
                                    <div class="content-center w-36">{teamData[column]}</div>
                                </div>
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style lang="scss" global>
    @import "../assets/main";
</style>
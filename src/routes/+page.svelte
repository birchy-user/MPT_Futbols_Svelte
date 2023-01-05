<script>
    import { onMount } from "svelte";

    export let data;

    const firstRoundMatches = import.meta.glob('../lib/XML_TestData/XMLFirstRound/*.xml');
    const secondRoundMatches = import.meta.glob('../lib/XML_TestData/XMLSecondRound/*.xml');

    const tournamentResultsTableColumns = {
        ranking: 'Vieta pēc kārtas',
        teamName: 'Komandas nosaukums',
        totalPoints: 'Kopā iegūtie punkti',
        winsInFullTime: 'Uzvaru skaits pamatlaikā',
        lossesInFullTime: 'Zaudējumu skaits pamatlaikā',
        winsInExtraTime: 'Uzvaru skaits papildlaikā',
        lossesInExtraTime: 'Zaudējumu skaits papildlaikā',
        totalGoalsFor: 'Spēlēs gūto vārtu skaits',
        totalGoalsAgainst: 'Spēlēs zaudēto vārtu skaits'
    };

    let matchesXMLData = [];
    let matchesJsonData = [];

    /** @type {Array.<string>} */
    let matchesXmlFileNames = [];

    let promise = Promise.resolve([]);

    async function loadMatches() {
        matchesXmlFileNames.forEach(matchFile => {
            matchesXMLData.push(
                fetch(matchFile)
                    .then(res => res.text())
                    .then(text => (new window.DOMParser()).parseFromString(text, "text/xml"))
                    .then(data => data.getElementsByTagName('Spele')[0])
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

    onMount(async() => {
        loadMatchesXMLData();
        
        console.log(matchesXmlFileNames);

        const { matchesJson } = data;
        matchesJsonData = matchesJson;

        console.log("Data from loading JSON files:", matchesJsonData);
    });

</script>

<button on:click={loadMatches}>
    Ielādēt spēļu datus
</button>

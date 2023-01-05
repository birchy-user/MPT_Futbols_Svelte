export async function load({ fetch, event }) {
    try {
        const f = (event && event.fetch) || fetch;

        const firstRoundMatches = import.meta.glob('$lib/JSON_TestData/JSONFirstRound/*.json');
        const secondRoundMatches = import.meta.glob('$lib/JSON_TestData/JSONSecondRound/*.json');

        let matchesJsonData = [];
        matchesJsonData.push(firstRoundMatches, secondRoundMatches);

        console.log("Matches JSON data: ", matchesJsonData);

        return {
            matchesJson: matchesJsonData
        };

    } catch (e) {
        console.log(`Error when loading match data: ${e}`);

        return {};
    }
}
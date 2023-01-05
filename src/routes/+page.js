/** @type {import('./$types').PageLoad} */
export async function load({ fetch, event }) {
    try {
        /** @type {fetch} */
        const f = (event && event.fetch) || fetch;

        const firstRoundMatches = import.meta.glob('$lib/JSON_TestData/JSONFirstRound/*.json');
        const secondRoundMatches = import.meta.glob('$lib/JSON_TestData/JSONSecondRound/*.json');

        let matchesJsonData = [];
        matchesJsonData.push(firstRoundMatches, secondRoundMatches);

        let matchesJsonRequests = [];
        matchesJsonData.forEach(listOfMatchesJsonFiles => {
            for (const matchJsonFile in listOfMatchesJsonFiles) {
                matchesJsonRequests.push(
                    f(matchJsonFile).then(res => res.json())
                );
            }
        });
        
        const response = Promise.all(matchesJsonRequests)
            .then(res => {return res; });


        return {
            matchesJson: await response
        };

    } catch (e) {
        console.log(`Error when loading match data: ${e}`);

        return {
            matchesJson: []
        };
    }
}
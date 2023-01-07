/** @type {import('./$types').PageLoad} */
export async function load({ fetch, event }) {
    try {
        /** @type {fetch} */
        const f = (event && event.fetch) || fetch;

        // Pieņemam, ka visi nepieciešamie JSON dati atrodas iekš "src/lib/JSON_TestData" mapes
        const matchesStatisticalFileData = import.meta.glob('$lib/JSON_TestData/**/*.json');
        // const firstRoundMatches = import.meta.glob('$lib/JSON_TestData/JSONFirstRound/*.json');
        // const secondRoundMatches = import.meta.glob('$lib/JSON_TestData/JSONSecondRound/*.json');
        
        // let matchesJsonData = [];
        // matchesJsonData.push(matchesStatisticalFileData);
        // matchesJsonData.push(firstRoundMatches, secondRoundMatches);
        
        let matchesJsonRequests = [];

        // for (const matchFile in matchesJsonData) {
        for (const matchFile in matchesStatisticalFileData) {
            matchesJsonRequests.push(
                f(matchFile).then(res => res.json())
            );
        }

        const response = Promise.all(matchesJsonRequests)
            .then(res => { return res; });

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

async function loadDataUsingInThenSyntax() {
    const matchesStatisticalFileData = import.meta.glob('$lib/JSON_TestData/**/*.json');

    /** @type {Object[]} */
    let matchesJsonData = [];
    for (const matchFile in matchesStatisticalFileData) {
        await matchesStatisticalFileData[matchFile]().then((mod) => {
            matchesJsonData.push(mod.Spele);
        });
    }

    const response = Promise.all(matchesJsonData)
        .then(res => { return res; });
}
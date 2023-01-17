<script>
	import PageTitle from "$components/PageTitle.svelte";
    import Football from "$components/icons/Football.svelte";

	import Spinner from "$components/loader/Spinner.svelte";
    import Table from "$components/Table.svelte";
    
    import { LFLData, LFLMatches } from "$lib/stores";
    
    // Augšupielādēto maču tabulas kolonnas:
    const matchesTableParams = {
        Laiks: 'Laiks',
        Komanda1: 'Komanda 1',
        Komanda2: 'Komanda 2',
        Skatitaji: 'Skatītāji',
        T: 'Līnījtiesneši',
        VT: 'Vecākais tiesnesis',
        Vieta: 'Vieta'
    };

    // Augšupielādēto maču parādīšana:
    let areMatchesLoaded = false;
    let savedMatches = [];

    // Ielādētie maču faili:
    /** @type {FileList} */
    let files;

    // Apstrādā augšupielādētos failus un pārbauda, vai tie ir pareizi JSON faili:
    $: if (files) {
        console.log("Augšupielādētie faili:", files);

        // Maču dati (iztukšo katru reizi, kad augšupielādē jaunus failus):
        let matchesJsonData = [];

        for (const file of files) {
            matchesJsonData.push(file.text());
        }

        Promise.all(matchesJsonData)
            .then((matchData) => {
                LFLData.setData(matchData);
            });
    };

    $: if ($LFLMatches !== undefined && $LFLMatches.length > 0) {
        areMatchesLoaded = true;
        console.log("LFLMatches data when loading uploaded matches", $LFLMatches);

        savedMatches = $LFLMatches.map((matchData) => {
            let [firstTeam, secondTeam] = matchData.Komanda.map(team => team.Nosaukums);
            let [firstAssistantReferee, secondAssistantReferee] = matchData.T.map(assistantRef => `${assistantRef.Vards} ${assistantRef.Uzvards}`);
            let matchOfficial = matchData.VT;

            return {
                Laiks: matchData.Laiks,
                Komanda1: firstTeam,
                Komanda2: secondTeam,
                Skatitaji: matchData.Skatitaji,
                T: `${firstAssistantReferee} un ${secondAssistantReferee}`,
                VT: `${matchOfficial.Vards} ${matchOfficial.Uzvards}`,
                Vieta: matchData.Vieta
            }
        });

        console.log("Saved matches: ", savedMatches);
    }

</script>

<PageTitle />

<div>
    <div class="z-10 top-0 w-full h-full flex">
        <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
            <div class="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg" style="width: 450px">
                <div class="w-max mx-auto mb-4">
                    <Football />
                </div>
                <div class="input_field flex flex-col w-max mx-auto text-center">
                    <label>
                        <input class="text-sm cursor-pointer w-36 hidden" 
                            bind:files
                            multiple
                            type="file"
                        />
                        <div class="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">
                            Augšupielādēt
                        </div>
                    </label>
    
                    <div class="title text-indigo-500">* vai iemest failus šeit</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div>
    {#if areMatchesLoaded && savedMatches.length > 0}
        <Table
            tableParams={matchesTableParams}
            tableData={savedMatches}
        />
    {:else}
        <span>Nav augšupielādētu maču...</span>
        <Spinner />
    {/if}
</div>
<script>
	import PageTitle from "$components/PageTitle.svelte";
    import Football from "$components/icons/Football.svelte";

    import Table from "$components/Table.svelte";
    
    import { LFLData, LFLMatches } from "$lib/stores";

    const title = "LFL augšupielādētie mači";
    const loadingText = "Nav augšupielādētu maču";
    
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
    let savedMatches = [];

    // Ielādētie maču faili:
    /** @type {FileList} */
    let files;

    let showDeleteButton = false;

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

        showDeleteButton = true;
    }

    function deleteUploadedMatches() {
        LFLData.setData();
        savedMatches = [];
        showDeleteButton = false;
    }

</script>

<PageTitle {title} />

<div class="top-0 w-full h-full flex">
    <div class="p-4 w-max m-auto rounded-lg">
        <div class="file_upload p-5 relative border-4 border-dotted border-gray-600 rounded-lg" style="width: 450px">
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
                {#if showDeleteButton}
                    <button on:click={deleteUploadedMatches} type="button" class="flex space-x-2 items-center px-3 py-2 bg-red-600 hover:bg-red-800 rounded-md drop-shadow-md">
                        <svg fill="white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z">
                            </path>
                        </svg>
                        <span class="text-white">Dzēst augšupielādētos mačus</span>
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<Table
    tableParams={matchesTableParams}
    tableData={savedMatches}
    {loadingText}
/>
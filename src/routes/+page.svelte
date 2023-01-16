<script>
	import PageTitle from "$components/PageTitle.svelte";
    import Football from "$components/icons/Football.svelte";

    import { LFLData, LFLMatches } from "$lib/stores";
	import Spinner from "$components/loader/Spinner.svelte";

    // Augšupielādēto maču tabulas kolonnas:
    const matchesTableParams = {
        nosaukums: 'Faila nosaukums',
        Laiks: 'Laiks',
        Skatitaji: 'Skatītāji',
        Vieta: 'Vieta',
        VT: 'Vadošais tiesnesis',
        Komanda1: 'Komanda 1',
        Komanda2: 'Komanda 2'
    };

    const matchesTableColumns = Object.keys(matchesTableParams);

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

            // savedMatches.push({
            //     nosaukums: ,
            //     Laiks:,
            //     Skatitaji:,
            //     Vieta:,
            //     VT: ,
            //     Komanda1: ,
            //     Komanda2:
            // });
        }

        Promise.all(matchesJsonData)
            .then((matchData) => {
                LFLData.setData(matchData);
            });
    };

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
    {#if $LFLMatches !== undefined && $LFLMatches.length > 0}
        {#each $LFLMatches as match}
            <!-- <span>Laiks: {new Date(match.Laiks).toDateString()}</span> -->
            <span>Vieta: {match.Vieta}</span>
            {#each match.Komanda as team, i}
                <span>Komanda nr.{i + 1}: {team.Nosaukums}</span>
            {/each}
        {/each}
    {:else}
        <span>Ielādē saglabātos mačus...</span>
        <Spinner />
    {/if}
</div>
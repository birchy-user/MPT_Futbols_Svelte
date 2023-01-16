<script>
    import { onMount } from "svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";
	import Spinner from "$components/loader/Spinner.svelte";
    import Table from "$components/Table.svelte";

    import { LFLMatches, LFLRefereesByAverageFoulsInEachMatch } from "$lib/stores";

    const title = 'LFL līgas stringrākie tiesneši';
    const breadcrumbs = [
        {
            href: '/',
            label: 'Sākums'
        },
        {
            label: 'Stringrākie tiesneši'
        }
    ];

    // Desmit rezultatīvāko spēlētāju tabulas kolonnas:
    const refereesByAvgFoulsTableParams = {
        Vards: 'Vārds',
        Uzvards: 'Uzvārds',
        VidejieSodiMaca: 'Vidējie piešķirtie sodi mačā',
        KopejieSodiMaca: 'Kopējie sodi pa visiem mačiem',
    };

    onMount(() => {
        console.log("LFLMatches data: ", $LFLMatches);
        
        console.log("LFLRefereesByAverageFoulsInEachMatch in /referee-fouls:", $LFLRefereesByAverageFoulsInEachMatch);
    });
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<div class="flex flex-col w-screen min-h-screen py-10">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden sm:rounded-lg">
            {#if $LFLRefereesByAverageFoulsInEachMatch === undefined || $LFLRefereesByAverageFoulsInEachMatch.length > 0 === false}
                <div class="bg-gray-800">
                    <Spinner 
                        classes="" 
                        loadingText="Ielādē datus par stingrākajiem tiesnešiem..." 
                    />
                </div>
            {:else}
                <Table 
                    tableParams={refereesByAvgFoulsTableParams}
                    tableData={$LFLRefereesByAverageFoulsInEachMatch}
                />
            {/if}
        </div>
    </div>
</div>
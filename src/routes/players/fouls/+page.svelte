<script>
    import { onMount } from "svelte";

    import YellowCard from "$components/icons/YellowCard.svelte";
    import RedCard from "$components/icons/RedCard.svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";
	import Spinner from "$components/loader/Spinner.svelte";
    import Table from "$components/Table.svelte";

    import { LFLMatches } from "$lib/stores";

    const title = 'LFL līgas rupjāko spēlētāju saraksts';
    const breadcrumbs = [
        {
            href: '/',
            label: 'Sākums'
        },
        {
            href: '/players',
            label: 'Rezultatīvākie spēlētāji'
        },
        {
            label: 'Rupjākie spēlētāji'
        }
    ];

    // Desmit rezultatīvāko spēlētāju tabulas kolonnas:
    const playersByFoulsCommitted = {
        Vards: 'Vārds',
        Uzvards: 'Uzvārds',
        KopejieSodi: 'Kopējie sodi pa visiem mačiem'
    };

    // const yellowAndRedCardIconCells = {
    //     DzeltenasKartinas: <YellowCard />,
    //     SarkanasKartinas: <RedCard />
    // };

    onMount(() => {
        console.log("LFLMatches data: ", $LFLMatches);
    });
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<div class="flex flex-col w-screen min-h-screen py-10">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden sm:rounded-lg">
            {#if $LFLMatches === undefined || $LFLMatches.length > 0 === false}
                <div class="bg-gray-800">
                    <Spinner 
                        classes="" 
                        loadingText="Ielādē datus par rupjākajiem spēlētājiem..." 
                    />
                </div>
            {:else}
                <Table 
                    tableParams={playersByFoulsCommitted}
                    tableData={[]}
                />
            {/if}
        </div>
    </div>
</div>
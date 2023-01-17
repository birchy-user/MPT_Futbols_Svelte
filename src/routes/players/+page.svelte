<script>
    import { onMount } from "svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";
    import Table from "$components/Table.svelte";

    import { LFLTopGoalScorers } from "$lib/stores";
    import { getFirstItemsByCount } from "$helpers/generators";

    const title = 'LFL līgas rezultatīvākie spēlētāji';
    const breadcrumbs = [
        {
            href: '/',
            label: 'Sākums'
        },
        {
            label: 'Rezultatīvākie spēlētāji'
        }
    ];

    // Desmit rezultatīvāko spēlētāju tabulas kolonnas:
    const topScorerTableParams = {
        Komanda: 'Komanda',
        KopejasRezultativasPiespeles: 'Rezultatīvo piespēļu skaits',
        KopejieIesistieVarti: 'Gūto vārtu skaits',
        Loma: 'Loma',
        Nr: 'Numurs',
        Uzvards: 'Uzvārds',
        Vards: 'Vārds'
    };

    let playerData = [];


    onMount(() => {
        playerData = [...$LFLTopGoalScorers];

        console.log("TopGoalScorer data in /players:", playerData);
    });
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<Table 
    tableParams={topScorerTableParams}
    tableData={getFirstItemsByCount(playerData, 10)}
/>
<script>
    import { onMount } from "svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";

    import { LFLMatches, LFLTopGoalScorers } from "$lib/stores";

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
        name: 'Vārds',
        lastname: 'Uzvārds',
        number: 'Numurs',
        teamName: 'Komandas nosaukums',
        totalGoalsScored: 'Gūto vārtu skaits',
        totalAssists: 'Rezultatīvo piespēļu skaits'
    };

    const topScorerTableColumns = Object.keys(topScorerTableParams);

    let playerData;

    onMount(() => {
        playerData = [...$LFLTopGoalScorers];

        console.log("LFLMatches data: ", $LFLMatches);

        console.log("TopGoalScorer data in /players:", playerData);
    });
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />
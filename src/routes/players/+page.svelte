<script>
    import { onMount } from "svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";

    import { LFLData } from "$lib/stores";

    import { getTeamsFromMatches, getPlayersAtMatchEndForTeams } from "$helpers/teamsData";
    import { aggregatePlayersOfTeamsByScoredGoals } from "$helpers/topScorerData";

    const title = 'LFL līgas rezultatīvākie spēlētāji';
    const breadcrumbs = [
        {
            href: '/',
            label: 'Sākums'
        },
        {
            href: '/players',
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

    let playerData = [];

    function getTopScorersInAllMatches() {

    }

    onMount(() => {
        playerData = LFLData.getData();
        console.log("playerData in /players is:", playerData);
    });
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />


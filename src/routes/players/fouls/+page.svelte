<script>
    import { onMount } from "svelte";

    // import YellowCard from "$components/icons/YellowCard.svelte";
    // import RedCard from "$components/icons/RedCard.svelte";

    import YellowCard from "$components/icons/YellowCard.svelte";
    import RedCard from "$components/icons/RedCard.svelte";

    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";
    import Table from "$components/Table.svelte";

    import { LFLMatches, LFLFoulsByMatches, LFLPlayersByBookings } from "$lib/stores";
	import { getFirstItemsByCount } from "$helpers/generators";

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
        Komanda: 'Komanda',
        KopejieSodi: 'Kopējie sodi pa visiem mačiem',
        Loma: 'Loma',
        Nr: 'Numurs',
        Uzvards: 'Uzvārds',
        Vards: 'Vārds'
    };

    const yellowAndRedCardColumns = {
        DzeltenasKartinas: YellowCard,
        SarkanasKartinas: RedCard
    };

    let playersByBookingsData = [];

    onMount(() => {
        playersByBookingsData = [...$LFLPlayersByBookings];

        console.log("LFLMatches data in /players/fouls: ", $LFLMatches);

        console.log("LFLFoulsByMatches data in /players/fouls:", $LFLFoulsByMatches);

        console.log("LFLPlayersByBookings data in /players/fouls: ", playersByBookingsData);
    });
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<Table 
    tableParams={playersByFoulsCommitted}
    tableData={getFirstItemsByCount(playersByBookingsData, 20)}
    specialColumnParams={yellowAndRedCardColumns}
/>
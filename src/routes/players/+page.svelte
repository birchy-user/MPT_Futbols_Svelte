<script>
    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";

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
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />


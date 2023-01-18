<script>
    import Breadcrumbs from "$components/Breadcrumbs.svelte";
	import PageTitle from "$components/PageTitle.svelte";
    import Table from "$components/Table.svelte";

    import { LFLRefereesByAverageFoulsInEachMatch } from "$lib/stores";

    const title = 'LFL līgas stringrākie tiesneši';
    const loadingText = "Nav datu";
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
        KopejieSodi: 'Kopējie sodi pa visiem mačiem',
    };
</script>

<PageTitle {title} />

<Breadcrumbs {breadcrumbs} {title} />

<Table 
    tableParams={refereesByAvgFoulsTableParams}
    tableData={$LFLRefereesByAverageFoulsInEachMatch}
    {loadingText}
/>
<script>
    import Football from "./icons/Football.svelte";

    const menuItems = [
        {
            label: 'Turnīra statistika',
            url: '/tournament'
        },
        {
            label: 'Rezultatīvākie spēlētāji',
            url: '/players'
        },
        {
            label: 'Rupjākie spēlētāji',
            url: '/players/fouls'
        },
        {
            label: 'Stingrākie tiesneši',
            url: '/referee-fouls'
        }
    ];

</script>

<header class="header border-b top-0 bg-white flex items-center px-3 py-2 z-10">
    <div>
        <a href="/">
            <div class="flex flex-row items-center">
                <Football />
                <span class="logo-label pl-4 font-semibold">LFL līga</span>
            </div>
        </a>
    </div>

    <nav class="nav font-semibold text-lg">
        <ul class="flex items-center">
            {#each menuItems as item}
                <a href={item.url}>
                    <li class="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer active">
                        {item.label}
                    </li>
                </a>
            {/each}
        </ul>
    </nav>

    <div class="justify-end">
        <span>Roberts Pelle rp18023</span>
    </div>
</header>

<style lang="scss">
    .header {
        position: sticky;
        justify-content: space-between;
    }
</style>
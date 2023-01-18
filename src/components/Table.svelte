<script>
	import { onMount } from "svelte";
	import Spinner from "$components/loader/Spinner.svelte";

    // Teksts, kuru rādīt tad, kad grib parādīt tukšu tabulu:
    export let loadingText = "";

    // Tabulas kolonnu nosaukumi un dati, kurus attēlot kolonnā
    export let tableParams = {};
    export let tableData;

    // Īpašās kolonnas, kur katra kolonna ir atsevišķa komponente, kuru renderēt teksta vietā:
    export let specialColumnParams = {};

    const tableColumns = Object.keys(tableParams);
    const specialColumns = Object.keys(specialColumnParams);

    let isLoaded = false;

    onMount(() => {
        isLoaded = true;
    });
</script>

<div class="flex flex-col w-screen min-h-screen py-10">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden sm:rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="bg-gray-800 text-xs uppercase font-medium">
                        <tr>
                            <th scope="col" class="pl-4">
                                <span>#</span>
                            </th>
                            {#each tableColumns as column}
                                <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                    <span>{tableParams[column]}</span>
                                </th>
                            {/each}
                            {#if specialColumns.length > 0}
                                {#each specialColumns as specialCol}
                                    <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                        <svelte:component this={specialColumnParams[specialCol]} />
                                    </th>
                                {/each}
                            {/if}
                        </tr>
                    </thead>
                    <tbody class="bg-gray-800">
                        {#if tableData === undefined || tableData.length > 0 === false}
                            {#if isLoaded}
                                {#if loadingText}
                                    <td colspan="100" class="text-left pl-4 py-4">
                                        <span>{loadingText}</span>
                                    </td>                                    
                                {/if}
                            {:else}
                                <td colspan="100">
                                    <Spinner classes="" {loadingText} />
                                </td>
                            {/if}
                        {:else}
                            {#each tableData ?? [] as data, i}
                                <tr class="{i % 2 == 0 ? 'bg-black bg-opacity-20' : ''}">
                                    <td class="pl-4">
                                        <span>{i + 1}</span>
                                    </td>
                    
                                    {#each tableColumns as column}
                                        <!-- {console.log("Tekošie dati table komponentē: ", column, key, data, i, tableData[i])} -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span>{data[column]}</span>
                                        </td>    
                                    {/each}

                                    {#if specialColumns.length > 0}
                                        {#each specialColumns as specialCol}
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span>{data[specialCol]}</span>
                                            </td>
                                        {/each}
                                    {/if}
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>




<!-- <table class="tournament-data-table min-w-full text-sm text-gray-400">
    <thead class="bg-gray-800 text-xs uppercase font-medium">
        <tr>
            <th class="pl-4">
                <span>#</span>
            </th>
            {#each tableColumns as column}
                <th scope="col" class="px-6 py-3 text-left tracking-wider">
                    <span>{tableParams[column]}</span>
                </th>
            {/each}
        </tr>
    </thead>
    <tbody class="bg-gray-800">
        {#each tableData ?? [] as data, i}
            <tr class="{i % 2 == 0 ? 'bg-black bg-opacity-20' : ''}">
                <td class="pl-4">
                    <span>{i + 1}</span>
                </td>

                {#each tableColumns as column}
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span>{data[column]}</span>
                    </td>    
                {/each}
            </tr>
        {/each}
    </tbody>
</table> -->
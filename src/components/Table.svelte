<script>
    // Tabulas kolonnu nosaukumi un dati, kurus attēlot kolonnā
    export let tableParams = {};
    export let tableData = [];

    const tableColumns = Object.keys(tableParams);
</script>

<table class="tournament-data-table min-w-full text-sm text-gray-400">
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
                    <!-- {console.log("Tekošie dati table komponentē: ", column, key, data, i, tableData[i])} -->
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span>{data[column]}</span>
                    </td>    
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
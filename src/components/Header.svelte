<script>
    const menuItems = [
        {
            label: 'Turnīra statistika',
            url: '/'
        },
        {
            label: 'Rezultatīvākie spēlētāji',
            url: '/players'
        }
    ];

</script>

<header class="top-0 w-full left-0 bg-white z-10">
    <div class="flex container mx-auto items-center">
		<nav class="mx-auto">
			<ul class="flex">
				{#each menuItems as item}
					<li class="mx-1">
						<a class="px-2 py-1" href={item.url}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</nav>
    </div>
</header>
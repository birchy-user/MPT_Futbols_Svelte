<script>
    export let title = '';
    export let breadcrumbs;
</script>

<div class="container mx-auto">
	<div class="pt-6">
		{#if breadcrumbs}
			<nav class="flex items-center text-sm font-medium text-gray-500 breadcrumbs">
				{#each breadcrumbs as breadcrumb}
					{#if breadcrumb.href}
						<a href={breadcrumb.href} class="hover:text-gray-700">
							{breadcrumb.label}
						</a>

					{:else}
						<span class="breadcrumb-label">{breadcrumb.label}</span>
					{/if}
					
					<span class="mx-2 text-gray-400" aria-hidden="true">&gt;</span>
				{/each}
			</nav>
		{/if}
		<h1 class="mt-2 text-xl text-bold">{title}</h1>
	</div>
</div>

<style lang="scss">
	.breadcrumbs span:last-child {
		display: none;
	}
</style>
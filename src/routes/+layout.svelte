<script>
    import Header from "$components/Header.svelte";
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="main flex-1 flex flex-col mt-4">
		<slot />
	</main>
</div>

<style lang="scss" global>
    @import "../assets/main";
</style>
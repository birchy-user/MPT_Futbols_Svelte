<script>
    import Header from "$components/Header.svelte";
	import "../assets/main.scss";
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="main flex-1 flex flex-col mt-4">
		<slot />
	</main>
</div>
<script>
	import FootballWhite from "$components/icons/FootballWhite.svelte";

	export let classes = "";
	export let loadingText = "Ielādē LFL datus...";
</script>

<div class={classes} role="status">
	<FootballWhite classes="animate-spin" />
    <span class="sr-only">{loadingText}</span>
</div>
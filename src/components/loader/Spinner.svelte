<script>
	import FootballWhite from "$components/icons/FootballWhite.svelte";

	export let classes = "";
</script>

<div class={classes} role="status">
	<FootballWhite classes="animate-spin" />
    <span class="sr-only">Ielādē LFL datus...</span>
</div>
<script>
	export let pause = false;
</script>

<div
	class="circle"
	class:pause-animation={pause}
/>

<style>
	.circle {
		animation: 0.75s linear 0s infinite normal none running rotate;
		border-color: #FF3E00 transparent #FF3E00 #FF3E00;
		border-image: initial;
		border-radius: 50%;
		border-style: solid;
		border-width: 4px;
		height: 60px;
		width: 60px;
	}
	.pause-animation {
		animation-play-state: paused;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
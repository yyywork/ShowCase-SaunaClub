<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
	onMount(async () => {
    goto('/')
	});
</script>

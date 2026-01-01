<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import About from "$lib/components/About.svelte";
	import Services from "$lib/components/Services.svelte";
	import Membership from "$lib/components/Membership.svelte";
	import Testimonials from "$lib/components/Testimonials.svelte";
</script>

<!-- Navbar is placed here based on specific focus request, normally could be in layout -->
<Navbar />

<main class="w-full">
	<Hero />
	<About />
	<Services />
	<Membership />
	<Testimonials />
</main>

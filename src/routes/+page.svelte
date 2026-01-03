<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import About from "$lib/components/About.svelte";
	import Services from "$lib/components/Services.svelte";
	import Membership from "$lib/components/Membership.svelte";
	import Testimonials from "$lib/components/Testimonials.svelte";
	import FAQ from "$lib/components/FAQ.svelte";
	import CTA from "$lib/components/CTA.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import LanguageTransition from "$lib/components/LanguageTransition.svelte";
	import ScrollToTop from "$lib/components/ScrollToTop.svelte";
</script>

<!-- Navbar is placed here based on specific focus request, normally could be in layout -->
<Navbar />

<LanguageTransition>
	<main class="w-full pt-24">
		<Hero />
		<About />
		<Services />
		<Membership />
		<Testimonials />
		<FAQ />
		<CTA />
	</main>

	<Footer />
</LanguageTransition>

<!-- Scroll to top button -->
<ScrollToTop />

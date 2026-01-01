<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let activeSection = "";

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target.id === "about") {
                        if (entry.isIntersecting) {
                            activeSection = "about";
                        } else {
                            // If about is not intersecting, we assume we might be above or below.
                            // For this simple case with 2 sections, if not about, it's likely hero (empty).
                            activeSection = "";
                        }
                    }
                });
            },
            { threshold: 0.5 },
        ); // 50% visibility triggers active

        const aboutSection = document.getElementById("about");
        if (aboutSection) observer.observe(aboutSection);

        return () => observer.disconnect();
    });
</script>

<nav class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-24">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
                <!-- Using a placeholder height, adjust based on actual SVG aspect ratio -->
                <a href="/">
                    <img
                        class="h-8 w-auto"
                        src="/images/logos/padel-light.svg"
                        alt="Padel Logo"
                    />
                </a>
            </div>

            <!-- Center Menu -->
            <div class="hidden lg:flex items-center space-x-2 xl:space-x-4">
                <a
                    href="#about"
                    class="{activeSection === 'about'
                        ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200 text-black'
                        : 'text-gray-600 hover:text-black border-transparent'} border px-4 py-1.5 rounded-full font-normal transition-all text-sm tracking-wide"
                    >Tentang Kami</a
                >
                <a
                    href="/"
                    class="text-gray-600 hover:text-black font-normal transition-all text-sm tracking-wide border border-transparent px-4 py-1.5 rounded-full"
                    >Program & Layanan</a
                >
                <a
                    href="/"
                    class="text-gray-600 hover:text-black font-normal transition-all text-sm tracking-wide border border-transparent px-4 py-1.5 rounded-full"
                    >Pelatihan</a
                >
                <a
                    href="/"
                    class="text-gray-600 hover:text-black font-normal transition-all text-sm tracking-wide border border-transparent px-4 py-1.5 rounded-full"
                    >Event & Komunitas</a
                >
                <a
                    href="/"
                    class="text-gray-600 hover:text-black font-normal transition-all text-sm tracking-wide border border-transparent px-4 py-1.5 rounded-full"
                    >Kontak</a
                >
            </div>

            <!-- Right Side -->
            <div class="hidden md:flex items-center space-x-8">
                <div
                    class="text-xs font-medium text-gray-500 flex items-center tracking-widest"
                >
                    <span
                        class="text-black cursor-pointer hover:opacity-70 transition-opacity"
                        >ID</span
                    >
                    <span class="mx-3 text-gray-300">|</span>
                    <span
                        class="cursor-pointer hover:text-black transition-colors"
                        >EN</span
                    >
                </div>
                <button
                    class="bg-black text-white px-8 py-3 rounded-full font-light text-sm hover:bg-gray-800 transition-all cursor-pointer tracking-wide"
                >
                    Booking Sekarang
                </button>
            </div>

            <!-- Mobile menu button placeholder -->
            <div class="lg:hidden">
                <button class="p-2 rounded-md text-gray-600">
                    <span class="sr-only">Open menu</span>
                    <!-- Hamburger icon -->
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</nav>

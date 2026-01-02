<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let activeSection = "";

    const sections = [
        "hero",
        "about",
        "services",
        "membership",
        "testimonials",
    ];

    onMount(() => {
        const handleScroll = () => {
            const navbarHeight = 100;
            let currentSection = "";
            let minDistance = Infinity;

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if section is in the viewport area below navbar
                    if (
                        rect.top <= navbarHeight &&
                        rect.bottom > navbarHeight
                    ) {
                        // Section is currently visible at navbar level
                        currentSection = sectionId;
                        break;
                    }
                    // Also check if section top is close to navbar
                    const distance = Math.abs(rect.top - navbarHeight);
                    if (
                        rect.top <= navbarHeight + 50 &&
                        rect.top > -rect.height &&
                        distance < minDistance
                    ) {
                        minDistance = distance;
                        currentSection = sectionId;
                    }
                }
            }

            // If hero is current, no active link
            if (currentSection === "hero") {
                activeSection = "";
            } else if (currentSection) {
                activeSection = currentSection;
            }
        };

        // Initial check
        handleScroll();

        // Listen for scroll
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<nav class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-24">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
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
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >Tentang Kami</a
                >
                <a
                    href="#services"
                    class="{activeSection === 'services'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >Program & Layanan</a
                >
                <a
                    href="#membership"
                    class="{activeSection === 'membership'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >Membership</a
                >
                <a
                    href="#testimonials"
                    class="{activeSection === 'testimonials'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >Testimoni</a
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

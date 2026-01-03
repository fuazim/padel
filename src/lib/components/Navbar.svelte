<script lang="ts">
    import { onMount } from "svelte";
    import { currentLanguage, type Language } from "$lib/stores/language";

    let activeSection = "";
    let mobileMenuOpen = false;

    // Translations for navbar
    const navTexts = {
        id: {
            about: "Tentang Kami",
            services: "Program & Layanan",
            membership: "Membership",
            testimonials: "Testimoni",
            bookNow: "Booking Sekarang",
        },
        en: {
            about: "About Us",
            services: "Programs & Services",
            membership: "Membership",
            testimonials: "Testimonials",
            bookNow: "Book Now",
        },
    };

    // Reactive text based on current language
    $: texts = navTexts[$currentLanguage];

    const sections = [
        "hero",
        "about",
        "services",
        "membership",
        "testimonials",
        "faq",
        "cta",
    ];

    // Sections that have corresponding nav links
    const navSections = ["about", "services", "membership", "testimonials"];

    function setLanguage(lang: Language) {
        currentLanguage.set(lang);
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function handleNavClick(e: Event, sectionId: string) {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 96; // h-24 = 96px
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
        closeMobileMenu();
    }

    onMount(() => {
        const handleScroll = () => {
            const scrollThreshold = 150;
            let currentSection = "";

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= scrollThreshold) {
                        currentSection = sectionId;
                    }
                }
            }

            if (
                currentSection === "hero" ||
                currentSection === "" ||
                !navSections.includes(currentSection)
            ) {
                activeSection = "";
            } else {
                activeSection = currentSection;
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Close mobile menu on escape key
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && mobileMenuOpen) {
                closeMobileMenu();
            }
        };
        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<nav class="fixed top-0 left-0 z-[9999] w-full bg-white/90 backdrop-blur-md">
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

            <!-- Center Menu (Desktop) -->
            <div class="hidden lg:flex items-center space-x-2 xl:space-x-4">
                <a
                    href="#about"
                    on:click={(e) => handleNavClick(e, "about")}
                    class="{activeSection === 'about'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >{texts.about}</a
                >
                <a
                    href="#services"
                    on:click={(e) => handleNavClick(e, "services")}
                    class="{activeSection === 'services'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >{texts.services}</a
                >
                <a
                    href="#membership"
                    on:click={(e) => handleNavClick(e, "membership")}
                    class="{activeSection === 'membership'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >{texts.membership}</a
                >
                <a
                    href="#testimonials"
                    on:click={(e) => handleNavClick(e, "testimonials")}
                    class="{activeSection === 'testimonials'
                        ? 'bg-[#2B95FF] text-white font-medium'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50 font-normal'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                    >{texts.testimonials}</a
                >
            </div>

            <!-- Right Side (Desktop) -->
            <div class="hidden lg:flex items-center space-x-8">
                <!-- Language Toggle -->
                <div
                    class="text-xs font-medium text-gray-500 flex items-center tracking-widest"
                >
                    <button
                        on:click={() => setLanguage("id")}
                        class="{$currentLanguage === 'id'
                            ? 'text-black'
                            : 'text-gray-400'} cursor-pointer hover:opacity-70 transition-all font-semibold"
                        >ID</button
                    >
                    <span class="mx-3 text-gray-300">|</span>
                    <button
                        on:click={() => setLanguage("en")}
                        class="{$currentLanguage === 'en'
                            ? 'text-black'
                            : 'text-gray-400'} cursor-pointer hover:text-black transition-all font-semibold"
                        >EN</button
                    >
                </div>
                <button
                    class="bg-black text-white px-8 py-3 rounded-full font-light text-sm hover:bg-gray-800 transition-all cursor-pointer tracking-wide"
                >
                    {texts.bookNow}
                </button>
            </div>

            <!-- Mobile menu button -->
            <div class="lg:hidden flex items-center space-x-4">
                <!-- Language Toggle Mobile -->
                <div
                    class="text-xs font-medium flex items-center tracking-widest"
                >
                    <button
                        on:click={() => setLanguage("id")}
                        class="{$currentLanguage === 'id'
                            ? 'text-black'
                            : 'text-gray-400'} cursor-pointer transition-all font-semibold"
                        >ID</button
                    >
                    <span class="mx-2 text-gray-300">|</span>
                    <button
                        on:click={() => setLanguage("en")}
                        class="{$currentLanguage === 'en'
                            ? 'text-black'
                            : 'text-gray-400'} cursor-pointer transition-all font-semibold"
                        >EN</button
                    >
                </div>

                <button
                    on:click={toggleMobileMenu}
                    class="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-expanded={mobileMenuOpen}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    <!-- Hamburger / Close icon -->
                    {#if mobileMenuOpen}
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    {:else}
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
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu Panel -->
    {#if mobileMenuOpen}
        <!-- Backdrop -->
        <div
            class="fixed inset-0 top-24 bg-black/20 backdrop-blur-sm lg:hidden z-40"
            on:click={closeMobileMenu}
            on:keydown={(e) => e.key === "Enter" && closeMobileMenu()}
            role="button"
            tabindex="0"
            aria-label="Close menu"
        ></div>

        <!-- Menu Panel -->
        <div
            class="absolute top-full left-0 right-0 bg-white shadow-xl lg:hidden z-50 border-t border-gray-100 animate-slideDown"
        >
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
                <div class="flex flex-col space-y-2">
                    <a
                        href="#about"
                        on:click={(e) => handleNavClick(e, "about")}
                        class="{activeSection === 'about'
                            ? 'bg-[#2B95FF] text-white'
                            : 'text-gray-700 hover:bg-gray-50'} px-4 py-3 rounded-xl transition-all text-base font-medium"
                    >
                        {texts.about}
                    </a>
                    <a
                        href="#services"
                        on:click={(e) => handleNavClick(e, "services")}
                        class="{activeSection === 'services'
                            ? 'bg-[#2B95FF] text-white'
                            : 'text-gray-700 hover:bg-gray-50'} px-4 py-3 rounded-xl transition-all text-base font-medium"
                    >
                        {texts.services}
                    </a>
                    <a
                        href="#membership"
                        on:click={(e) => handleNavClick(e, "membership")}
                        class="{activeSection === 'membership'
                            ? 'bg-[#2B95FF] text-white'
                            : 'text-gray-700 hover:bg-gray-50'} px-4 py-3 rounded-xl transition-all text-base font-medium"
                    >
                        {texts.membership}
                    </a>
                    <a
                        href="#testimonials"
                        on:click={(e) => handleNavClick(e, "testimonials")}
                        class="{activeSection === 'testimonials'
                            ? 'bg-[#2B95FF] text-white'
                            : 'text-gray-700 hover:bg-gray-50'} px-4 py-3 rounded-xl transition-all text-base font-medium"
                    >
                        {texts.testimonials}
                    </a>

                    <!-- Divider -->
                    <div class="border-t border-gray-100 my-2"></div>

                    <!-- Book Now Button -->
                    <button
                        class="bg-black text-white px-6 py-3.5 rounded-full font-medium text-base hover:bg-gray-800 transition-all cursor-pointer tracking-wide w-full"
                    >
                        {texts.bookNow}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</nav>

<style>
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-slideDown {
        animation: slideDown 0.2s ease-out forwards;
    }
</style>

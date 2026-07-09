<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { languageState, authState } from "$lib/state.svelte";
    import { auth } from "$lib/auth";

    async function handleLogout() {
        try {
            await auth.signOut();
        } catch (err) {
            console.error("SignOut failed:", err);
        }
        authState.user = null;
        window.location.href = "/login";
    }

    let activeSection = $state("");
    let mobileMenuOpen = $state(false);
    let imageLoadError = $state(false);

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
                        currentSection = sectionId;
                        break;
                    }
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

            if (currentSection === "hero") {
                activeSection = "";
            } else if (currentSection) {
                activeSection = currentSection;
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<nav class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20 sm:h-24">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
                <a href="/">
                    <img
                        class="h-7 sm:h-8 w-auto"
                        src="/images/logos/padel-light.svg"
                        alt="Padel Logo"
                    />
                </a>
            </div>

            <!-- Center Menu (Desktop only) -->
            <div class="hidden lg:flex items-center space-x-1 xl:space-x-3">
                {#if $page.url.pathname === "/"}
                    <a
                        href="#about"
                        class="{activeSection === 'about'
                            ? 'bg-[#2B95FF] text-white font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                        >{languageState.current === 'ID' ? 'Tentang Kami' : 'About Us'}</a
                    >
                    <a
                        href="#services"
                        class="{activeSection === 'services'
                            ? 'bg-[#2B95FF] text-white font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                        >{languageState.current === 'ID' ? 'Program & Layanan' : 'Programs & Services'}</a
                    >
                    <a
                        href="#membership"
                        class="{activeSection === 'membership'
                            ? 'bg-[#2B95FF] text-white font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                        >Membership</a
                    >
                    <a
                        href="#testimonials"
                        class="{activeSection === 'testimonials'
                            ? 'bg-[#2B95FF] text-white font-semibold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'} px-4 py-1.5 rounded-full transition-all text-sm tracking-wide"
                        >{languageState.current === 'ID' ? 'Testimoni' : 'Testimonials'}</a
                    >
                {/if}
            </div>

            <!-- Right Side (Desktop only) -->
            <div class="hidden lg:flex items-center space-x-10">
                <!-- Language Toggle -->
                <div class="text-xs font-semibold text-slate-400 flex items-center tracking-widest select-none mr-4">
                    <button
                        onclick={() => languageState.current = 'ID'}
                        class="{languageState.current === 'ID' ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'} cursor-pointer hover:text-slate-900 transition-colors focus:outline-none"
                    >
                        ID
                    </button>
                    <span class="mx-3 text-slate-200">|</span>
                    <button
                        onclick={() => languageState.current = 'EN'}
                        class="{languageState.current === 'EN' ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'} cursor-pointer hover:text-slate-900 transition-colors focus:outline-none"
                    >
                        EN
                    </button>
                </div>
                
                <!-- Navigation Button -->
                {#if authState.user}
                    <!-- User is logged in -->
                    <div class="flex items-center gap-4">
                        <a
                            href="/profile"
                            class="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-[#2B95FF] text-slate-700 hover:text-[#2B95FF] text-sm font-semibold rounded-full transition-all cursor-pointer bg-transparent"
                        >
                            {#if authState.user.image && !imageLoadError}
                                <img 
                                    src={authState.user.image} 
                                    alt={authState.user.name} 
                                    onerror={() => imageLoadError = true}
                                    class="w-6 h-6 rounded-full object-cover" 
                                />
                            {:else}
                                <div class="w-6 h-6 rounded-full bg-[#2B95FF]/10 text-[#2B95FF] flex items-center justify-center text-xs font-bold font-mono">
                                    {authState.user.avatar || 'US'}
                                </div>
                            {/if}
                            <span>{authState.user.name}</span>
                        </a>
                    </div>
                {:else}
                    <!-- User is NOT logged in -->
                    <a
                        href="/login"
                        class="bg-slate-900 text-white px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-black transition-all cursor-pointer tracking-wide inline-block"
                    >
                        {languageState.current === 'ID' ? 'Masuk' : 'Login'}
                    </a>
                {/if}
            </div>

            <!-- Right Side (Mobile Menu & Profile) -->
            <div class="flex lg:hidden items-center gap-3">
                {#if authState.user}
                    <a
                        href="/profile"
                        class="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 overflow-hidden cursor-pointer"
                        title={authState.user.name}
                    >
                        {#if authState.user.image && !imageLoadError}
                            <img 
                                src={authState.user.image} 
                                alt={authState.user.name} 
                                onerror={() => imageLoadError = true}
                                class="w-full h-full object-cover" 
                            />
                        {:else}
                            <div class="w-full h-full bg-[#2B95FF]/10 text-[#2B95FF] flex items-center justify-center text-[10px] font-bold font-mono">
                                {authState.user.avatar || 'US'}
                            </div>
                        {/if}
                    </a>
                {/if}
                <button 
                    onclick={() => mobileMenuOpen = true}
                    class="p-2 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer"
                    aria-label="Open menu"
                >
                    <i class="ph-duotone ph-list text-xl"></i>
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- Mobile Drawer Overlay & Content (OUTSIDE nav to avoid backdrop-blur containing block) -->
<!-- Backdrop -->
<button
    onclick={() => mobileMenuOpen = false}
    class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm focus:outline-none transition-all duration-300 {mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}"
    aria-label="Close sidebar"
></button>

<!-- Drawer -->
<aside
    class="fixed inset-y-0 right-0 z-[70] w-72 max-w-full bg-white border-l border-slate-200 flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out {mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}"
>
    <div>
        <!-- Header of Drawer -->
        <div class="h-20 flex items-center justify-between px-6 border-b border-slate-100">
            <img
                class="h-6 w-auto"
                src="/images/logos/padel-light.svg"
                alt="Padel Logo"
            />
            <button 
                onclick={() => mobileMenuOpen = false} 
                class="p-2 rounded-xl text-slate-400 hover:text-slate-800 border border-slate-100 flex items-center justify-center cursor-pointer" 
                aria-label="Close menu"
            >
                <i class="ph-duotone ph-x text-lg"></i>
            </button>
        </div>

        <!-- Navigation List -->
        <nav class="p-5 flex flex-col gap-2">
            <a
                href="/#about"
                onclick={() => mobileMenuOpen = false}
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
                <i class="ph-duotone ph-info text-base shrink-0"></i>
                <span>{languageState.current === 'ID' ? 'Tentang Kami' : 'About Us'}</span>
            </a>
            <a
                href="/#services"
                onclick={() => mobileMenuOpen = false}
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
                <i class="ph-duotone ph-sparkle text-base shrink-0"></i>
                <span>{languageState.current === 'ID' ? 'Program & Layanan' : 'Programs & Services'}</span>
            </a>
            <a
                href="/#membership"
                onclick={() => mobileMenuOpen = false}
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
                <i class="ph-duotone ph-identification-card text-base shrink-0"></i>
                <span>Membership</span>
            </a>
            <a
                href="/#testimonials"
                onclick={() => mobileMenuOpen = false}
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
                <i class="ph-duotone ph-chats-teardrop text-base shrink-0"></i>
                <span>{languageState.current === 'ID' ? 'Testimoni' : 'Testimonials'}</span>
            </a>
        </nav>
    </div>

    <!-- Footer area in mobile menu -->
    <div class="p-6 border-t border-slate-100 flex flex-col gap-4">
        <!-- Mobile Language Selector -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold">
            <span class="text-slate-400">Language</span>
            <div class="flex gap-2">
                <button 
                    onclick={() => languageState.current = 'ID'} 
                    class="hover:text-slate-900 transition-colors {languageState.current === 'ID' ? 'text-[#2B95FF]' : 'text-slate-400'} cursor-pointer"
                >ID</button>
                <span class="text-slate-200">|</span>
                <button 
                    onclick={() => languageState.current = 'EN'} 
                    class="hover:text-slate-900 transition-colors {languageState.current === 'EN' ? 'text-[#2B95FF]' : 'text-slate-400'} cursor-pointer"
                >EN</button>
            </div>
        </div>

        {#if authState.user}
            <!-- Mobile profile link & Logout -->
            <a
                href="/profile"
                onclick={() => mobileMenuOpen = false}
                class="w-full text-center border border-slate-200 text-slate-800 py-3.5 rounded-full font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
                {#if authState.user.image && !imageLoadError}
                    <img 
                        src={authState.user.image} 
                        alt={authState.user.name} 
                        onerror={() => imageLoadError = true}
                        class="w-5 h-5 rounded-full object-cover" 
                    />
                {:else}
                    <div class="w-5 h-5 rounded-full bg-[#2B95FF]/10 text-[#2B95FF] flex items-center justify-center text-[10px] font-bold font-mono">
                        {authState.user.avatar || 'US'}
                    </div>
                {/if}
                <span>{authState.user.name}</span>
            </a>
            <button
                onclick={() => { mobileMenuOpen = false; handleLogout(); }}
                class="w-full text-center bg-rose-50 text-rose-600 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-100 transition-all cursor-pointer"
            >
                {languageState.current === 'ID' ? 'Keluar' : 'Logout'}
            </button>
        {:else}
            <!-- Login Button -->
            <a
                href="/login"
                onclick={() => mobileMenuOpen = false}
                class="w-full text-center bg-slate-900 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-black transition-all cursor-pointer"
            >
                {languageState.current === 'ID' ? 'Masuk' : 'Login'}
            </a>
        {/if}
    </div>
</aside>

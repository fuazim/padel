<script lang="ts">
    import { page } from "$app/stores";
    import { fade, slide } from "svelte/transition";
    import { languageState, authState } from "$lib/state.svelte";

    let { children } = $props();

    // Check current active route
    const currentPath = $derived($page.url.pathname);

    const menuItems = [
        {
            path: "/admin",
            name: "Overview",
            nameID: "Ringkasan",
            iconClass: "ph-duotone ph-chart-bar"
        },
        {
            path: "/admin/bookings",
            name: "Bookings",
            nameID: "Penyewaan",
            iconClass: "ph-duotone ph-calendar-check"
        },
        {
            path: "/admin/members",
            name: "Members",
            nameID: "Anggota",
            iconClass: "ph-duotone ph-users"
        },
        {
            path: "/admin/newsletter",
            name: "Newsletter",
            nameID: "Newsletter",
            iconClass: "ph-duotone ph-envelope-simple-open"
        },
        {
            path: "/admin/courts",
            name: "Courts",
            nameID: "Lapangan",
            iconClass: "ph-duotone ph-map-pin"
        },
        {
            path: "/admin/membership-plans",
            name: "Membership Plans",
            nameID: "Paket Membership",
            iconClass: "ph-duotone ph-identification-card"
        }
    ];

    let mobileSidebarOpen = $state(false);
    let isCollapsed = $state(false);

    // Client-side Admin Route Guard
    $effect(() => {
        if (authState.checked) {
            if (!authState.user) {
                window.location.href = "/login";
            } else {
                const email = authState.user.email;
                if (email !== "admin@padel.com" && email !== "admin@padelin.com") {
                    window.location.href = "/login";
                }
            }
        }
    });
</script>

{#if !authState.checked}
    <!-- Premium Centered Spinner -->
    <div class="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-[#2B95FF]/10 border-t-[#2B95FF] rounded-full animate-spin"></div>
            <p class="text-xs text-slate-400 font-light tracking-wide">Loading Admin Panel...</p>
        </div>
    </div>
{:else if authState.user && (authState.user.email === "admin@padel.com" || authState.user.email === "admin@padelin.com")}
    <div class="min-h-screen bg-slate-50 text-slate-600 flex font-sans w-full">
    
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-slate-100 shrink-0 transition-all duration-300 overflow-x-hidden {isCollapsed ? 'w-20' : 'w-64'}">
        <!-- Logo -->
        <div class="h-20 flex items-center border-b border-slate-100 {isCollapsed ? 'justify-center px-4' : 'px-6'}">
            <a href="/" class="flex items-center gap-2.5 {isCollapsed ? 'hidden' : 'flex'}">
                <img src="/images/logos/padel-light.svg" alt="Padel Logo" class="h-6 w-auto" />
                <span class="text-[9px] bg-[#2B95FF]/10 text-[#2B95FF] px-2 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">Admin</span>
            </a>
            {#if isCollapsed}
                <a href="/" class="flex items-center justify-center w-9 h-9 rounded-xl bg-[#2B95FF]/10 text-[#2B95FF] font-bold text-sm">
                    P
                </a>
            {/if}
        </div>
        
        <!-- Navigation Links -->
        <nav class="flex-grow p-4 flex flex-col gap-1.5 mt-4 overflow-y-auto {isCollapsed ? 'items-center' : ''}">
            {#each menuItems as item}
                {@const active = currentPath === item.path}
                <a
                    href={item.path}
                    class="flex items-center gap-3 rounded-xl text-sm font-semibold transition-all {active ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'} {isCollapsed ? 'w-12 h-12 p-0 justify-center' : 'w-full px-4 py-3'}"
                    title={isCollapsed ? (languageState.current === "ID" ? item.nameID : item.name) : ""}
                >
                    <i class="{item.iconClass} text-lg shrink-0"></i>
                    <span class={isCollapsed ? 'hidden' : 'block'}>{languageState.current === "ID" ? item.nameID : item.name}</span>
                </a>
            {/each}
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-slate-100 flex flex-col gap-2 shrink-0 {isCollapsed ? 'items-center' : ''}">
            <!-- Language switcher - simple id | en -->
            <div class="flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-xs {isCollapsed ? 'h-10 w-12 p-0' : 'px-4 py-2 w-full'}">
                {#if isCollapsed}
                    <button 
                        onclick={() => languageState.current = languageState.current === 'ID' ? 'EN' : 'ID'} 
                        class="hover:text-slate-900 transition-colors font-bold text-[#2B95FF] uppercase w-full h-full flex items-center justify-center"
                        title="Change Language"
                    >
                        {languageState.current}
                    </button>
                {:else}
                    <div class="flex gap-2 font-semibold">
                        <button 
                            onclick={() => languageState.current = 'ID'} 
                            class="hover:text-slate-900 transition-colors {languageState.current === 'ID' ? 'text-[#2B95FF]' : 'text-gray-400'}"
                        >ID</button>
                        <span class="text-slate-200">|</span>
                        <button 
                            onclick={() => languageState.current = 'EN'} 
                            class="hover:text-slate-900 transition-colors {languageState.current === 'EN' ? 'text-[#2B95FF]' : 'text-gray-400'}"
                        >EN</button>
                    </div>
                {/if}
            </div>
            <!-- Minimize/Maximize Toggle Button in Footer -->
            <button
                onclick={() => isCollapsed = !isCollapsed}
                class="flex items-center gap-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all {isCollapsed ? 'w-12 h-12 p-0 justify-center' : 'w-full px-4 py-3'}"
                title={isCollapsed ? "Expand" : "Minimize"}
            >
                <i class="ph-duotone ph-sidebar-simple text-lg shrink-0"></i>
                <span class={isCollapsed ? 'hidden' : 'block'}>
                    Minimize
                </span>
            </button>
            <!-- Logout Button -->
            <a
                href="/login"
                class="flex items-center gap-3 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-all {isCollapsed ? 'w-12 h-12 p-0 justify-center' : 'w-full px-4 py-3'}"
                title={isCollapsed ? (languageState.current === "ID" ? "Keluar" : "Log out") : ""}
            >
                <i class="ph-duotone ph-sign-out text-lg shrink-0"></i>
                <span class={isCollapsed ? 'hidden' : 'block'}>{languageState.current === "ID" ? "Keluar" : "Log out"}</span>
            </a>
        </div>
    </aside>

    <!-- Mobile Sidebar Backdrop & Drawer -->
    {#if mobileSidebarOpen}
        <!-- Backdrop -->
        <button
            onclick={() => mobileSidebarOpen = false}
            class="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm focus:outline-none"
            in:fade={{ duration: 200 }}
            aria-label="Close sidebar"
        ></button>

        <!-- Drawer -->
        <aside
            class="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between"
            in:slide={{ axis: "x", duration: 300 }}
        >
            <div>
                <!-- Logo -->
                <div class="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                    <div class="flex items-center gap-3">
                        <img src="/images/logos/padel-light.svg" alt="Padel Logo" class="h-6 w-auto" />
                        <span class="text-[9px] bg-[#2B95FF]/10 text-[#2B95FF] px-2 py-0.5 rounded font-mono uppercase font-semibold">ADMIN</span>
                    </div>
                    <button onclick={() => mobileSidebarOpen = false} class="text-slate-400 hover:text-slate-800 cursor-pointer" aria-label="Close sidebar">
                        <i class="ph-duotone ph-x text-xl"></i>
                    </button>
                </div>

                <!-- Navigation Links -->
                <nav class="p-4 flex flex-col gap-1.5 mt-4">
                    {#each menuItems as item}
                        {@const active = currentPath === item.path}
                        <a
                            href={item.path}
                            onclick={() => mobileSidebarOpen = false}
                            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all {active ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}"
                        >
                            <i class="{item.iconClass} text-lg shrink-0"></i>
                            <span>{languageState.current === "ID" ? item.nameID : item.name}</span>
                        </a>
                    {/each}
                </nav>
            </div>

            <!-- Footer options (Mobile) -->
            <div class="p-4 border-t border-slate-100 flex flex-col gap-2">
                <!-- Simple id | en toggle -->
                <div class="flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-xs px-4 py-2 w-full">
                    <div class="flex gap-2 font-semibold">
                        <button 
                            onclick={() => languageState.current = 'ID'} 
                            class="hover:text-slate-900 transition-colors {languageState.current === 'ID' ? 'text-[#2B95FF]' : 'text-gray-400'}"
                        >ID</button>
                        <span class="text-slate-200">|</span>
                        <button 
                            onclick={() => languageState.current = 'EN'} 
                            class="hover:text-slate-900 transition-colors {languageState.current === 'EN' ? 'text-[#2B95FF]' : 'text-gray-400'}"
                        >EN</button>
                    </div>
                </div>
                <a
                    href="/login"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-all"
                >
                    <i class="ph-duotone ph-sign-out text-lg shrink-0"></i>
                    <span>{languageState.current === "ID" ? "Keluar" : "Log out"}</span>
                </a>
            </div>
        </aside>
    {/if}

    <!-- Main Content Area -->
    <div class="flex-grow flex flex-col min-w-0">
        
        <!-- Header -->
        <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 z-10 shrink-0">
            <!-- Left: Mobile menu trigger & Breadcrumb -->
            <div class="flex items-center gap-4">
                <button
                    onclick={() => mobileSidebarOpen = true}
                    class="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 bg-white flex items-center justify-center"
                    aria-label="Open sidebar"
                >
                    <i class="ph-duotone ph-list text-2xl"></i>
                </button>
                <div class="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-light">
                    <span>Admin Panel</span>
                    <span>/</span>
                    <span class="text-slate-900 font-bold capitalize">
                        {languageState.current === "ID" 
                            ? (menuItems.find(m => m.path === currentPath)?.nameID || "Dashboard") 
                            : (menuItems.find(m => m.path === currentPath)?.name || "Dashboard")}
                    </span>
                </div>
            </div>

            <!-- Right: User Menu -->
            <div class="flex items-center gap-3">
                <div class="flex flex-col text-right hidden sm:flex">
                    <span class="text-sm font-semibold text-slate-800">Administrator</span>
                    <span class="text-[9px] text-[#2B95FF] tracking-wider uppercase font-mono font-bold">Super Admin</span>
                </div>
                <div class="w-10 h-10 rounded-full border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center text-slate-700 font-bold">
                    A
                </div>
            </div>
        </header>

        <main class="flex-grow p-6 sm:p-8 overflow-y-auto">
            {@render children()}
        </main>

    </div>
</div>
{/if}

<style>
    /* Scoped global styles for table borders in Admin dashboard */
    :global(table) {
        border-collapse: collapse !important;
        border: none !important;
    }
    :global(th) {
        border-bottom: 1px solid #f1f5f9 !important; /* slate-100 */
    }
    :global(td) {
        border-bottom: 1px solid #f8fafc !important; /* slate-50 */
    }
</style>

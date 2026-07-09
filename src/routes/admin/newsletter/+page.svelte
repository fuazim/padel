<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";

    let { data } = $props();

    let subscribers = $state<any[]>([]);

    onMount(() => {
        if (data && data.dbSuccess && data.newsletterSubs) {
            subscribers = data.newsletterSubs;
        } else {
            try {
                const saved = localStorage.getItem("newsletter_emails");
                if (saved) {
                    subscribers = JSON.parse(saved);
                } else {
                    const defaultSubs = [
                        { id: 1, email: "fauzi@example.com", joinDate: "2026-07-09" },
                        { id: 2, email: "rian.h@example.com", joinDate: "2026-07-09" },
                        { id: 3, email: "alex.jones@gmail.com", joinDate: "2026-07-08" },
                        { id: 4, email: "sarah.smith@yahoo.com", joinDate: "2026-07-08" },
                        { id: 5, email: "m.lutfi@outlook.com", joinDate: "2026-07-06" },
                        { id: 6, email: "jessica_p@gmail.com", joinDate: "2026-07-05" },
                        { id: 7, email: "taufik.hidayat@indonesia.id", joinDate: "2026-07-03" }
                    ];
                    subscribers = defaultSubs;
                    localStorage.setItem("newsletter_emails", JSON.stringify(defaultSubs));
                }
            } catch (_) {
                subscribers = [];
            }
        }
    });

    function saveToStorage(updated: any[]) {
        try {
            localStorage.setItem("newsletter_emails", JSON.stringify(updated));
        } catch (_) {}
    }

    let searchVal = $state("");
    let showCopiedAlert = $state(false);

    const filteredSubs = $derived(
        subscribers.filter(s => s.email.toLowerCase().includes(searchVal.toLowerCase()))
    );

    function copyEmailsToClipboard() {
        const emails = subscribers.map(s => s.email).join(", ");
        navigator.clipboard.writeText(emails).then(() => {
            showCopiedAlert = true;
            setTimeout(() => {
                showCopiedAlert = false;
            }, 3000);
        });
    }

    function removeSubscriber(email: string) {
        const target = subscribers.find(s => s.email === email);
        subscribers = subscribers.filter(s => s.email !== email);
        saveToStorage(subscribers);

        if (data && data.dbSuccess && target) {
            const formData = new FormData();
            formData.append('id', target.id.toString());
            fetch('?/deleteEmail', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Database sync failed:", err));
        }
    }
</script>

<div class="flex flex-col gap-6 text-slate-600" in:fade={{ duration: 300 }}>
    
    <!-- Title Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 class="text-slate-900 text-2xl font-bold tracking-tight">
                {languageState.current === "ID" ? "Daftar Berlangganan Newsletter" : "Newsletter Subscribers"}
            </h1>
            <p class="text-sm font-light text-slate-400 mt-1">
                {languageState.current === "ID" ? "Lihat dan kelola email promosi & penawaran khusus dari member." : "View and manage subscriber emails for promotional campaigns."}
            </p>
        </div>

        <button
            onclick={copyEmailsToClipboard}
            class="bg-[#2B95FF] hover:bg-[#1a85f0] text-white text-sm font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-all flex items-center gap-2"
        >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 4h6m-6 4h6m-2 5h4" />
            </svg>
            <span>{languageState.current === "ID" ? "Salin Semua Email" : "Copy All Emails"}</span>
        </button>
    </div>

    <!-- Alert Success -->
    {#if showCopiedAlert}
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3.5 rounded-2xl text-sm font-medium" transition:fade>
            {languageState.current === "ID" 
                ? "✓ Seluruh email berhasil disalin ke papan klip!" 
                : "✓ All emails have been copied to your clipboard!"}
        </div>
    {/if}

    <!-- Search & List Card (No Shadows) -->
    <div class="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6">
        <!-- Search -->
        <div class="relative w-full max-w-xs">
            <input
                type="text"
                placeholder={languageState.current === "ID" ? "Cari email..." : "Search email..."}
                bind:value={searchVal}
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-1 focus:ring-[#2B95FF]/10 text-slate-950 text-sm rounded-xl py-2.5 pl-10 pr-4 outline-none placeholder-slate-400 transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <!-- Table List -->
        <div class="overflow-x-auto">
            {#if filteredSubs.length === 0}
                <div class="text-center py-12 text-slate-400 font-light flex flex-col items-center gap-3">
                    <svg class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{languageState.current === "ID" ? "Tidak ada subscriber" : "No subscribers found"}</span>
                </div>
            {:else}
                <table class="w-full text-left text-sm font-light">
                    <thead>
                        <tr class="border-b border-slate-100 text-slate-400 text-xs tracking-wider uppercase font-semibold">
                            <th class="py-4 px-4">Email</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Tanggal Daftar" : "Subscribe Date"}</th>
                            <th class="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-600">
                        {#each filteredSubs as sub (sub.email)}
                            <tr class="hover:bg-slate-50 transition-all" in:fade={{ duration: 200 }}>
                                <td class="py-4 px-4 text-slate-900 font-semibold">{sub.email}</td>
                                <td class="py-4 px-4 text-slate-500">{sub.joinDate || sub.date}</td>
                                <td class="py-4 px-4 text-right">
                                    <button
                                        onclick={() => removeSubscriber(sub.email)}
                                        class="p-2 hover:text-rose-500 transition-colors cursor-pointer text-slate-400"
                                        title="Remove Subscriber"
                                    >
                                        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>

</div>

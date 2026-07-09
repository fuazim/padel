<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";
    import CustomDropdown from "$lib/components/CustomDropdown.svelte";

    let { data } = $props();

    interface Member {
        id: string;
        name: string;
        email: string;
        phone: string;
        plan: string;
        joinDate: string;
    }

    // Manage Members State
    let searchQuery = $state("");
    let planFilter = $state("All"); // All, Casual, Pro, Premium
    let plansList = $state<any[]>([]);

    let membersList = $state<Member[]>([
        { id: "MB-101", name: "Fauzi Anwar", email: "fauzi@example.com", phone: "08123456789", plan: "Premium", joinDate: "2026-01-12" },
        { id: "MB-102", name: "Rian Hidayat", email: "rian.h@example.com", phone: "08567891234", plan: "Pro", joinDate: "2026-02-20" },
        { id: "MB-103", name: "Nadia Putri", email: "nadia.p@example.com", phone: "08198765432", plan: "Casual", joinDate: "2026-03-05" },
        { id: "MB-104", name: "Daniel Surya", email: "daniel@example.com", phone: "08123334445", plan: "Pro", joinDate: "2026-03-18" },
        { id: "MB-105", name: "Maya Rahman", email: "maya@example.com", phone: "08579998887", plan: "Casual", joinDate: "2026-04-01" },
        { id: "MB-106", name: "Andreas Santoso", email: "andreas@example.com", phone: "08112223334", plan: "Premium", joinDate: "2026-04-15" },
        { id: "MB-107", name: "Rico Halim", email: "rico@example.com", phone: "08998887776", plan: "Pro", joinDate: "2026-05-10" }
    ]);

    onMount(() => {
        if (data && data.dbSuccess) {
            if (data.plans) {
                plansList = data.plans.map((p: any) => ({
                    value: p.name,
                    label: p.name
                }));
            }
            if (data.members) {
                membersList = data.members.map((m: any) => ({
                    id: String(m.id),
                    name: m.name,
                    email: m.email,
                    phone: m.phone,
                    plan: m.membershipTier,
                    joinDate: "2026-01-12"
                }));
            }
        } else {
            // Load custom plans from localStorage
            try {
                const savedPlans = localStorage.getItem("custom_plans");
                if (savedPlans) {
                    const parsed = JSON.parse(savedPlans);
                    plansList = parsed.map((p: any) => ({
                        value: p.name,
                        label: p.name
                    }));
                }
            } catch (_) {}

            // Fallback default options
            if (plansList.length === 0) {
                plansList = [
                    { value: "Casual", label: "Casual" },
                    { value: "Pro", label: "Pro" },
                    { value: "Premium", label: "Premium" }
                ];
            }

            // Load custom members from localStorage
            try {
                const savedMembers = localStorage.getItem("custom_members");
                if (savedMembers) {
                    membersList = JSON.parse(savedMembers);
                } else {
                    localStorage.setItem("custom_members", JSON.stringify(membersList));
                }
            } catch (_) {}
        }
    });

    function saveMembers(updated: Member[]) {
        try {
            localStorage.setItem("custom_members", JSON.stringify(updated));
        } catch (_) {}
    }

    const filteredMembers = $derived(
        membersList.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  m.phone.includes(searchQuery);
            const matchesPlan = planFilter === "All" || m.plan === planFilter;
            return matchesSearch && matchesPlan;
        })
    );

    function changePlan(id: string, newPlan: string) {
        membersList = membersList.map(m => {
            if (m.id === id) {
                return { ...m, plan: newPlan };
            }
            return m;
        });
        saveMembers(membersList);

        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('tier', newPlan);
            fetch('?/updateTier', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Database sync failed:", err));
        }
    }

    function removeMember(id: string) {
        membersList = membersList.filter(m => m.id !== id);
        saveMembers(membersList);

        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('id', id);
            fetch('?/deleteMember', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Database sync failed:", err));
        }
    }
</script>

<div class="flex flex-col gap-6 text-slate-600" in:fade={{ duration: 300 }}>
    
    <!-- Title -->
    <div>
        <h1 class="text-slate-900 text-2xl font-bold tracking-tight">
            {languageState.current === "ID" ? "Kelola Anggota Padel Club" : "Manage Padel Club Members"}
        </h1>
        <p class="text-sm font-light text-slate-400 mt-1">
            {languageState.current === "ID" ? "Pantau keanggotaan aktif, paket member, dan tanggal bergabung." : "Monitor active subscriptions, member tiers, and joining dates."}
        </p>
    </div>

    <!-- Filters Bar (No Shadows) -->
    <div class="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Search Input -->
        <div class="relative w-full md:max-w-xs">
            <input
                type="text"
                placeholder={languageState.current === "ID" ? "Cari nama, email, hp..." : "Search name, email, phone..."}
                bind:value={searchQuery}
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-1 focus:ring-[#2B95FF]/10 text-slate-950 text-sm rounded-xl py-2.5 pl-10 pr-4 outline-none placeholder-slate-400 transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <!-- Plan Filter Tabs (Dynamic) -->
        <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
            <button
                onclick={() => planFilter = "All"}
                class="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer {planFilter === 'All' ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800'}"
            >
                All
            </button>
            {#each plansList as plan}
                <button
                    onclick={() => planFilter = plan.value}
                    class="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer {planFilter === plan.value ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800'}"
                >
                    {plan.label}
                </button>
            {/each}
        </div>
    </div>

    <!-- Members Table Card (No Shadows) -->
    <div class="bg-white border border-slate-200 rounded-[2rem] p-6">
        <div class="overflow-x-auto min-h-[260px]">
            {#if filteredMembers.length === 0}
                <div class="text-center py-12 text-slate-400 font-light flex flex-col items-center gap-3">
                    <i class="ph-duotone ph-users-three text-3xl text-slate-300"></i>
                    <span>{languageState.current === "ID" ? "Member tidak ditemukan" : "No members found"}</span>
                </div>
            {:else}
                <table class="w-full text-left text-sm font-light">
                    <thead>
                        <tr class="border-b border-slate-100 text-slate-400 text-xs tracking-wider uppercase font-semibold">
                            <th class="py-4 px-4">Member ID</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Nama" : "Name"}</th>
                            <th class="py-4 px-4">Email & Phone</th>
                            <th class="py-4 px-4" style="width: 220px;">Membership Plan</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Tanggal Bergabung" : "Join Date"}</th>
                            <th class="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-650">
                        {#each filteredMembers as member (member.id)}
                            <tr class="hover:bg-slate-50/50 transition-all" in:fade={{ duration: 200 }}>
                                <td class="py-4 px-4 font-mono font-bold text-slate-450">{member.id}</td>
                                <td class="py-4 px-4 text-slate-900 font-semibold">{member.name}</td>
                                <td class="py-4 px-4 flex flex-col gap-0.5">
                                    <span class="text-slate-900 text-xs font-semibold">{member.email}</span>
                                    <span class="text-slate-400 text-[11px]">{member.phone}</span>
                                </td>
                                <td class="py-4 px-4">
                                    <CustomDropdown
                                        placeholder="Select Plan"
                                        options={plansList}
                                        value={member.plan}
                                        onChange={(val) => changePlan(member.id, val)}
                                    />
                                </td>
                                <td class="py-4 px-4 text-slate-500 font-medium">{member.joinDate}</td>
                                <td class="py-4 px-4 text-right">
                                    <button
                                        onclick={() => removeMember(member.id)}
                                        class="p-2 hover:text-rose-600 transition-colors cursor-pointer text-slate-400 bg-transparent border-none outline-none"
                                        title="Revoke Membership"
                                    >
                                        <i class="ph-duotone ph-trash text-lg"></i>
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

<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";

    let { data } = $props();

    // Manage Bookings State
    let searchQuery = $state("");
    let statusFilter = $state("All"); // All, Paid, Pending, Cancelled

    const defaultBookings = [
        { id: "BK-890", name: "Fauzi Anwar", court: "Court Alpha (Indoor)", date: "2026-07-09", time: "18:00 - 20:00", amount: 360000, status: "Paid" },
        { id: "BK-889", name: "Rian Hidayat", court: "Court Beta (Outdoor)", date: "2026-07-09", time: "16:00 - 17:00", amount: 130000, status: "Paid" },
        { id: "BK-888", name: "Nadia Putri", court: "Court Arena (Championship)", date: "2026-07-10", time: "19:00 - 21:00", amount: 440000, status: "Pending" },
        { id: "BK-887", name: "Daniel Surya", court: "Court Alpha (Indoor)", date: "2026-07-10", time: "08:00 - 10:00", amount: 360000, status: "Paid" },
        { id: "BK-886", name: "Maya Rahman", court: "Court Beta (Outdoor)", date: "2026-07-11", time: "10:00 - 12:00", amount: 260000, status: "Cancelled" },
        { id: "BK-885", name: "Andreas Santoso", court: "Court Alpha (Indoor)", date: "2026-07-12", time: "06:00 - 08:00", amount: 360000, status: "Paid" },
        { id: "BK-884", name: "Kevin Wijaya", court: "Court Arena (Championship)", date: "2026-07-12", time: "15:00 - 16:00", amount: 220000, status: "Pending" }
    ];

    let bookingsList = $state<any[]>([]);

    onMount(() => {
        if (data && data.dbSuccess && data.bookings) {
            bookingsList = data.bookings;
        } else {
            try {
                const saved = localStorage.getItem("custom_admin_bookings");
                if (saved) {
                    bookingsList = JSON.parse(saved);
                } else {
                    bookingsList = defaultBookings;
                    localStorage.setItem("custom_admin_bookings", JSON.stringify(defaultBookings));
                }
            } catch (_) {
                bookingsList = defaultBookings;
            }
        }
    });

    // Derived filtered list
    const filteredBookings = $derived(
        bookingsList.filter(b => {
            const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  b.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || b.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
    );

    function saveToStorage(updated: any[]) {
        try {
            localStorage.setItem("custom_admin_bookings", JSON.stringify(updated));
            
            // Also sync back to profile bookings if it has the current user
            const profileSaved = JSON.parse(localStorage.getItem("custom_profile_bookings") || "[]");
            const updatedProfile = profileSaved.map((pb: any) => {
                const match = updated.find(b => b.id === pb.id);
                return match ? { ...pb, status: match.status } : pb;
            }).filter((pb: any) => updated.some(b => b.id === pb.id));
            localStorage.setItem("custom_profile_bookings", JSON.stringify(updatedProfile));
        } catch (_) {}
    }

    function updateStatus(id: string, newStatus: string) {
        bookingsList = bookingsList.map(b => {
            if (b.id === id) {
                return { ...b, status: newStatus };
            }
            return b;
        });
        saveToStorage(bookingsList);

        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('status', newStatus);
            fetch('?/updateStatus', { method: 'POST', body: formData }).catch(err => console.error(err));
        }
    }

    function deleteBooking(id: string) {
        bookingsList = bookingsList.filter(b => b.id !== id);
        saveToStorage(bookingsList);

        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('id', id);
            fetch('?/deleteBooking', { method: 'POST', body: formData }).catch(err => console.error(err));
        }
    }
</script>

<div class="flex flex-col gap-6 text-slate-600" in:fade={{ duration: 300 }}>
    
    <!-- Title -->
    <div>
        <h1 class="text-slate-900 text-2xl font-bold tracking-tight">
            {languageState.current === "ID" ? "Kelola Penyewaan Lapangan" : "Manage Court Bookings"}
        </h1>
        <p class="text-sm font-light text-slate-400 mt-1">
            {languageState.current === "ID" ? "Lihat, konfirmasi, atau batalkan sewa lapangan member." : "View, confirm, or cancel member court bookings."}
        </p>
    </div>

    <!-- Filters Bar (No Shadows) -->
    <div class="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Search Input -->
        <div class="relative w-full md:max-w-xs">
            <input
                type="text"
                placeholder={languageState.current === "ID" ? "Cari Pelanggan / ID..." : "Search Customer / ID..."}
                bind:value={searchQuery}
                class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-1 focus:ring-[#2B95FF]/10 text-slate-950 text-sm rounded-xl py-2.5 pl-10 pr-4 outline-none placeholder-slate-400 transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <!-- Status Filter tabs -->
        <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
            {#each ["All", "Paid", "Pending", "Cancelled"] as status}
                <button
                    onclick={() => statusFilter = status}
                    class="px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer {statusFilter === status ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800'}"
                >
                    {status}
                </button>
            {/each}
        </div>
    </div>

    <!-- Bookings Table Card (No Shadows) -->
    <div class="bg-white border border-slate-200 rounded-[2rem] p-6">
        <div class="overflow-x-auto">
            {#if filteredBookings.length === 0}
                <div class="text-center py-12 text-slate-400 font-light flex flex-col items-center gap-3">
                    <svg class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{languageState.current === "ID" ? "Penyewaan tidak ditemukan" : "No bookings found"}</span>
                </div>
            {:else}
                <table class="w-full text-left text-sm font-light">
                    <thead>
                        <tr class="border-b border-slate-100 text-slate-400 text-xs tracking-wider uppercase font-semibold">
                            <th class="py-4 px-4">Booking ID</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Pelanggan" : "Customer"}</th>
                            <th class="py-4 px-4">Lapangan</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Tanggal & Waktu" : "Date & Time"}</th>
                            <th class="py-4 px-4">Total</th>
                            <th class="py-4 px-4">Status</th>
                            <th class="py-4 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-600">
                        {#each filteredBookings as booking (booking.id)}
                            <tr class="hover:bg-slate-50 transition-all" in:fade={{ duration: 200 }}>
                                <td class="py-4 px-4 font-mono font-bold text-slate-900">{booking.id}</td>
                                <td class="py-4 px-4 text-slate-900 font-semibold">{booking.name}</td>
                                <td class="py-4 px-4 text-slate-500">{booking.court}</td>
                                <td class="py-4 px-4 text-slate-500">
                                    {booking.date} &bull; <span class="text-xs">{booking.time}</span>
                                </td>
                                <td class="py-4 px-4 text-slate-900 font-bold">
                                    Rp {booking.amount.toLocaleString("id-ID")}
                                </td>
                                <td class="py-4 px-4">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold inline-block {booking.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : booking.status === 'Pending' ? 'bg-[#FFA800]/10 border border-[#FFA800]/20 text-[#FFA800]' : 'bg-rose-50 text-rose-700'}">
                                        {booking.status}
                                    </span>
                                </td>
                                <td class="py-4 px-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        {#if booking.status === "Pending"}
                                            <button
                                                onclick={() => updateStatus(booking.id, "Paid")}
                                                class="px-3 py-1 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                                                title="Mark as Paid"
                                            >
                                                Confirm
                                            </button>
                                        {/if}
                                        {#if booking.status !== "Cancelled"}
                                            <button
                                                onclick={() => updateStatus(booking.id, "Cancelled")}
                                                class="px-3 py-1 bg-rose-50 border border-rose-250 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                                                title="Cancel Booking"
                                            >
                                                Cancel
                                            </button>
                                        {/if}
                                        <button
                                            onclick={() => deleteBooking(booking.id)}
                                            class="p-1 hover:text-slate-800 transition-colors cursor-pointer text-slate-400"
                                            title="Delete booking record"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>

</div>

<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { languageState, authState } from "$lib/state.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { auth } from "$lib/auth";
    import QRCode from "qrcode";

    let { data } = $props();

    async function handleLogout() {
        try {
            await auth.signOut();
        } catch (err) {
            console.error("SignOut failed:", err);
        }
        authState.user = null;
        window.location.href = "/login";
    }

    // Tab state
    let activeTab = $state("bookings"); // bookings, membership, settings

    // Mock User Profile Data
    let userProfile = $state({
        name: "Fauzi Anwar",
        email: "fauzi@example.com",
        phone: "08123456789",
        avatar: "FA",
        membershipTier: "Pro Member",
        memberSince: "2026-01-12",
        memberExpiry: "2027-01-12"
    });

    // Mock User Bookings Data
    const defaultBookings = [
        { id: "BK-890", court: "Court Alpha (Indoor)", date: "2026-07-09", time: "18:00 - 20:00", amount: 360000, status: "Paid", code: "PADEL-78A9C", addons: [] },
        { id: "BK-893", court: "Court Arena (Championship)", date: "2026-07-15", time: "19:00 - 20:00", amount: 220000, status: "Pending", code: "PADEL-91X3E", addons: [] }
    ];

    let bookings = $state<any[]>([]);
    let showTicketModal = $state(false);
    let selectedBookingForTicket = $state<any>(null);
    let qrCodeUrl = $state("");

    $effect(() => {
        if (selectedBookingForTicket) {
            QRCode.toDataURL(selectedBookingForTicket.code, {
                width: 200,
                margin: 1,
                color: {
                    dark: "#0f172a", // slate-900
                    light: "#ffffff" // white
                }
            })
            .then(url => {
                qrCodeUrl = url;
            })
            .catch(err => {
                console.error(err);
            });
        }
    });

    let plansList = $state<any[]>([]);

    onMount(() => {
        if (data && data.dbSuccess) {
            if (data.profile) {
                userProfile = {
                    name: data.profile.name,
                    email: data.profile.email,
                    phone: data.profile.phone,
                    avatar: data.profile.name.substring(0, 2).toUpperCase(),
                    membershipTier: data.profile.membershipTier,
                    memberSince: "2026-01-12",
                    memberExpiry: data.profile.memberExpiry
                };
                formName = userProfile.name;
                formPhone = userProfile.phone;
            }
            if (data.bookings) {
                bookings = data.bookings;
            }
            if (data.plans && data.plans.length > 0) {
                plansList = data.plans;
            }
        } else {
            // Load custom plans
            try {
                const savedPlans = localStorage.getItem("custom_plans");
                if (savedPlans) {
                    plansList = JSON.parse(savedPlans);
                }
            } catch (_) {}

            if (plansList.length === 0) {
                plansList = [
                    {
                        id: "casual",
                        name: "Casual Member",
                        price: "Rp 500.000",
                        priceEN: "$35",
                        features: ["Diskon sewa lapangan 5%", "Akses booking 3 hari lebih awal"],
                        featuresEN: ["5% off court rentals", "3 days early booking access"]
                    },
                    {
                        id: "pro",
                        name: "Pro Member",
                        price: "Rp 1.800.000",
                        priceEN: "$120",
                        features: ["Diskon sewa lapangan 10%", "Akses booking 7 hari lebih awal", "Gratis 1x coaching per bulan"],
                        featuresEN: ["10% off court rentals", "7 days early booking access", "1 free coaching session/mo"]
                    },
                    {
                        id: "elite",
                        name: "Premium Member",
                        price: "Rp 3.000.000",
                        priceEN: "$200",
                        features: ["Diskon sewa lapangan 20%", "Akses booking 14 hari lebih awal", "Gratis 3x coaching per bulan", "Akses turnamen eksklusif"],
                        featuresEN: ["20% off court rentals", "14 days early booking access", "3 free coaching sessions/mo", "Exclusive tournament access"]
                    }
                ];
            }

            // Load profile from localStorage
            try {
                const savedProfile = localStorage.getItem("user_profile_data");
                if (savedProfile) {
                    userProfile = JSON.parse(savedProfile);
                    formName = userProfile.name;
                    formPhone = userProfile.phone;
                } else {
                    localStorage.setItem("user_profile_data", JSON.stringify(userProfile));
                    formName = userProfile.name;
                    formPhone = userProfile.phone;
                }
            } catch (_) {}

            // Load profile bookings
            try {
                const saved = localStorage.getItem("custom_profile_bookings");
                if (saved) {
                    bookings = JSON.parse(saved);
                } else {
                    bookings = defaultBookings;
                    localStorage.setItem("custom_profile_bookings", JSON.stringify(defaultBookings));
                }
            } catch (_) {
                bookings = defaultBookings;
            }
        }
    });

    function selectPlan(planName: string) {
        userProfile.membershipTier = planName;
        try {
            localStorage.setItem("user_profile_data", JSON.stringify(userProfile));
        } catch (_) {}

        // Sync to database
        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('planName', planName);
            formData.append('email', userProfile.email);
            fetch('?/updatePlan', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Plan sync failed:", err));
        }
        
        // Trigger save success notification
        saveSuccess = true;
        setTimeout(() => {
            saveSuccess = false;
        }, 3000);
    }

    // Profile update form state
    let formName = $state("");
    let formPhone = $state("");
    let formPassword = $state("");
    let formNewPassword = $state("");
    let saveSuccess = $state(false);
    let imageLoadError = $state(false);

    // Client-side Profile Route Guard
    $effect(() => {
        if (authState.checked) {
            if (!authState.user) {
                window.location.href = "/login";
            }
        }
    });

    $effect(() => {
        if (authState.user) {
            userProfile.name = authState.user.name;
            userProfile.email = authState.user.email;
            userProfile.avatar = authState.user.avatar || authState.user.name.substring(0, 2).toUpperCase();
            formName = authState.user.name;

            // Fetch actual database record for the logged-in email
            if (data && data.dbSuccess) {
                const formData = new FormData();
                formData.append('email', authState.user.email);
                fetch('?/getProfile', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(resData => {
                    try {
                        let parsed;
                        if (resData.data) {
                            parsed = typeof resData.data === 'string' ? JSON.parse(resData.data) : resData.data;
                        }
                        if (parsed && parsed.profile) {
                            userProfile.phone = parsed.profile.phone || "";
                            userProfile.membershipTier = parsed.profile.membershipTier || "Casual Member";
                            userProfile.memberExpiry = parsed.profile.memberExpiry || "2027-01-12";
                            formPhone = userProfile.phone;
                        }
                    } catch (err) {
                        console.error("Failed to parse getProfile response:", err);
                    }
                })
                .catch(err => console.error("Failed to fetch database profile:", err));
            }
        }
    });

    function handleSaveSettings(e: SubmitEvent) {
        e.preventDefault();
        
        userProfile.name = formName;
        userProfile.phone = formPhone;
        formPassword = "";
        formNewPassword = "";

        try {
            localStorage.setItem("user_profile_data", JSON.stringify(userProfile));
        } catch (_) {}

        // Sync to database
        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('name', formName);
            formData.append('phone', formPhone);
            formData.append('email', userProfile.email);
            fetch('?/updateProfile', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Profile sync failed:", err));
        }

        // Trigger save success notification
        saveSuccess = true;
        setTimeout(() => {
            saveSuccess = false;
        }, 3000);
    }
</script>

{#if !authState.checked}
    <!-- Premium Centered Spinner -->
    <div class="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-[#2B95FF]/10 border-t-[#2B95FF] rounded-full animate-spin"></div>
            <p class="text-xs text-slate-400 font-light tracking-wide">Loading Profile...</p>
        </div>
    </div>
{:else if authState.user}
    <Navbar />

    <div class="relative min-h-[calc(100vh-100px)] w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-600">
    <!-- Visual background gradient highlights -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2B95FF]/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFA800]/3 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-[1400px] mx-auto z-10 relative">
        <!-- Dashboard Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Side Panel: Combined Profile Card + Menu (4 Columns) -->
            <div class="lg:col-span-4 flex flex-col gap-6 bg-white border border-slate-200 rounded-[2rem] p-6">
                <!-- User Profile Overview -->
                <div class="flex flex-col items-center text-center pb-6 border-b border-slate-100 gap-4">
                    <!-- Avatar -->
                    {#if authState.user && authState.user.image && !imageLoadError}
                        <img 
                            src={authState.user.image} 
                            alt={userProfile.name} 
                            onerror={() => imageLoadError = true}
                            class="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm" 
                        />
                    {:else}
                        <div class="w-20 h-20 rounded-full bg-[#2B95FF] border-2 border-slate-100 text-white text-2xl font-bold flex items-center justify-center">
                            {userProfile.avatar}
                        </div>
                    {/if}
                    <div class="flex flex-col gap-1 items-center">
                        <h2 class="text-slate-900 text-xl font-bold tracking-tight">{userProfile.name}</h2>
                        <span class="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#2B95FF]/10 border border-[#2B95FF]/20 text-[#2B95FF]">
                            {userProfile.membershipTier}
                        </span>
                        <p class="text-slate-500 text-xs font-light mt-1">{userProfile.email}</p>
                        <p class="text-slate-400 text-[11px] font-light">{userProfile.phone}</p>
                    </div>
                </div>

                <!-- Tabs Menu Stack -->
                <div class="flex flex-col gap-1.5">
                    <button
                        onclick={() => activeTab = "bookings"}
                        class="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-3 {activeTab === 'bookings' ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}"
                    >
                        <i class="ph-duotone ph-calendar-check text-lg"></i>
                        <span>{languageState.current === "ID" ? "Booking Aktif" : "My Bookings"}</span>
                    </button>
                    <button
                        onclick={() => activeTab = "membership"}
                        class="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-3 {activeTab === 'membership' ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}"
                    >
                        <i class="ph-duotone ph-shield-check text-lg"></i>
                        <span>{languageState.current === "ID" ? "Keanggotaan" : "Membership Plan"}</span>
                    </button>
                    <button
                        onclick={() => activeTab = "settings"}
                        class="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-3 {activeTab === 'settings' ? 'bg-[#2B95FF] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}"
                    >
                        <i class="ph-duotone ph-gear text-lg"></i>
                        <span>{languageState.current === "ID" ? "Pengaturan" : "Settings"}</span>
                    </button>
                    <button
                        onclick={handleLogout}
                        class="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-3 text-rose-600 hover:bg-rose-50/50 mt-2"
                    >
                        <i class="ph-duotone ph-sign-out text-lg"></i>
                        <span>{languageState.current === "ID" ? "Keluar Akun" : "Log Out"}</span>
                    </button>
                </div>
            </div>

            <!-- Right Side Panel: Main Dashboard Content (8 Columns) -->
            <div class="lg:col-span-8 flex flex-col gap-6">
                
                <!-- Tab: My Bookings -->
                {#if activeTab === "bookings"}
                    <div class="flex flex-col gap-6" in:fade={{ duration: 200 }}>
                        <div class="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-6">
                            
                            <!-- Header Area inside content card -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                                <div>
                                    <h3 class="text-slate-900 text-lg font-bold">
                                        {languageState.current === "ID" ? "Jadwal Sewa Aktif" : "Active Court Bookings"}
                                    </h3>
                                    <p class="text-slate-400 text-xs font-light mt-0.5">
                                        {languageState.current === "ID" ? "Daftar pemesanan lapangan Anda yang sedang aktif." : "List of your currently active bookings."}
                                    </p>
                                </div>
                                <a
                                    href="/booking"
                                    class="bg-slate-900 text-white hover:bg-black text-xs font-semibold px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-1.5 w-fit"
                                >
                                    <i class="ph-duotone ph-plus-circle text-base text-[#2B95FF]"></i>
                                    <span>{languageState.current === "ID" ? "Booking Baru" : "New Booking"}</span>
                                </a>
                            </div>

                            {#if bookings.length === 0}
                                <div class="text-center py-16 text-slate-400 font-light flex flex-col items-center gap-3">
                                    <i class="ph-duotone ph-calendar-blank text-5xl text-slate-300"></i>
                                    <span class="text-sm">{languageState.current === "ID" ? "Belum ada jadwal penyewaan aktif" : "No active bookings found"}</span>
                                </div>
                            {:else}
                                <div class="flex flex-col divide-y divide-slate-100">
                                    {#each bookings as booking}
                                        <div class="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div class="flex flex-col gap-2">
                                                <div class="flex flex-wrap items-center gap-2.5">
                                                    <span class="text-slate-900 font-bold text-base sm:text-lg">{booking.court}</span>
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase {booking.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#FFA800]/10 text-[#FFA800]'}">
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                
                                                <div class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-light text-slate-500">
                                                    <span class="flex items-center gap-1.5">
                                                        <i class="ph-duotone ph-calendar text-sm text-[#2B95FF] shrink-0"></i>
                                                        <span class="font-medium text-slate-600">{booking.date}</span>
                                                    </span>
                                                    <span class="flex items-center gap-1.5">
                                                        <i class="ph-duotone ph-clock text-sm text-[#2B95FF] shrink-0"></i>
                                                        <span class="font-medium text-slate-600">{booking.time}</span>
                                                    </span>
                                                </div>
                                                
                                                <div class="flex items-center gap-2 text-xs font-light text-slate-400 mt-1">
                                                    <span>Kode Booking:</span>
                                                    <span class="font-mono text-slate-800 font-bold tracking-wider bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded">{booking.code}</span>
                                                </div>

                                                {#if booking.addons && booking.addons.length > 0}
                                                    <div class="flex flex-wrap items-center gap-1.5 mt-2">
                                                        {#each booking.addons as addon}
                                                            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/50">
                                                                {addon}
                                                            </span>
                                                        {/each}
                                                    </div>
                                                {/if}
                                            </div>

                                            <div class="flex md:flex-col justify-between md:justify-end items-end gap-1.5 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                                <div class="text-left md:text-right flex flex-col">
                                                    <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider hidden md:block">Total Harga</span>
                                                    <span class="text-slate-950 font-bold text-base sm:text-lg">Rp {booking.amount.toLocaleString("id-ID")}</span>
                                                </div>
                                                <!-- Action to show detail -->
                                                <button 
                                                    onclick={() => { selectedBookingForTicket = booking; showTicketModal = true; }}
                                                    class="text-xs text-[#2B95FF] hover:text-[#1a85f0] hover:underline cursor-pointer font-bold flex items-center gap-1.5 bg-transparent border-none outline-none p-0"
                                                >
                                                    <i class="ph-duotone ph-qr-code text-base"></i>
                                                    <span>{languageState.current === "ID" ? "Lihat Barcode" : "View Barcode"}</span>
                                                </button>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}

                <!-- Tab: Membership -->
                {#if activeTab === "membership"}
                    <div class="flex flex-col gap-6" in:fade={{ duration: 200 }}>
                        <div class="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-6">
                            
                            <div>
                                <h3 class="text-slate-900 text-lg font-bold border-b border-slate-100 pb-4">
                                    {languageState.current === "ID" ? "Keanggotaan Aktif" : "Active Membership"}
                                </h3>
                            </div>

                            <!-- Current Plan Summary (Flat, No Shadows) -->
                            <div class="bg-[#2B95FF]/5 border border-[#2B95FF]/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-[#2B95FF] text-white rounded-2xl flex items-center justify-center shrink-0">
                                        <i class="ph-duotone ph-crown text-2xl"></i>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">{languageState.current === "ID" ? "Paket Saat Ini" : "Current Plan"}</span>
                                        <span class="text-slate-900 text-lg font-extrabold tracking-tight mt-0.5">{userProfile.membershipTier}</span>
                                    </div>
                                </div>
                                <div class="flex flex-col sm:items-end text-left sm:text-right gap-1.5">
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-xs text-slate-400">{languageState.current === "ID" ? "Tanggal Berakhir:" : "Expires on:"}</span>
                                        <span class="text-slate-800 text-xs font-bold font-mono">{userProfile.memberExpiry}</span>
                                    </div>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                        Active &bull; Auto-Renewal
                                    </span>
                                </div>
                            </div>

                            <!-- Membership Cards Grid Section (Flat, No Shadows) -->
                            <div class="mt-4">
                                <h4 class="text-slate-900 text-base font-bold tracking-tight mb-4">
                                    {languageState.current === "ID" ? "Pilih Paket Keanggotaan" : "Choose Membership Tiers"}
                                </h4>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {#each plansList as plan}
                                        {@const isCurrent = userProfile.membershipTier.toLowerCase().includes(plan.name.toLowerCase()) || plan.name.toLowerCase().includes(userProfile.membershipTier.toLowerCase())}
                                        <div class="bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all {isCurrent ? 'border-[#2B95FF] ring-2 ring-[#2B95FF]/5 bg-[#2B95FF]/1' : 'border-slate-200 hover:border-slate-300'}">
                                            <div>
                                                <!-- Plan Header -->
                                                <div class="flex items-center justify-between gap-2 mb-4">
                                                    <span class="text-slate-900 text-base font-bold tracking-tight">{plan.name}</span>
                                                    {#if isCurrent}
                                                        <span class="bg-[#2B95FF]/10 text-[#2B95FF] px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase">Active</span>
                                                    {/if}
                                                </div>

                                                <!-- Plan Price -->
                                                <div class="flex items-baseline gap-1 mb-6">
                                                    <span class="text-slate-900 text-xl sm:text-2xl font-extrabold tracking-tight">
                                                        {languageState.current === "ID" ? plan.price : (plan.priceEN || plan.price)}
                                                    </span>
                                                    <span class="text-slate-400 text-xs font-light">/ {languageState.current === "ID" ? "bln" : "mo"}</span>
                                                </div>

                                                <!-- Features List -->
                                                <ul class="flex flex-col gap-3 text-xs sm:text-sm font-light text-slate-500 mb-6">
                                                    {#each (languageState.current === "ID" ? plan.features : (plan.featuresEN || plan.features)) as feature}
                                                        <li class="flex items-start gap-2">
                                                            <i class="ph-duotone ph-check-circle text-base text-[#2B95FF] shrink-0 mt-0.5"></i>
                                                            <span>{feature}</span>
                                                        </li>
                                                    {/each}
                                                </ul>
                                            </div>

                                            <!-- Choose Plan Action Button (Flat, No Shadows) -->
                                            <button
                                                onclick={() => selectPlan(plan.name)}
                                                disabled={isCurrent}
                                                class="w-full text-center py-2.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer {isCurrent ? 'bg-[#2B95FF]/10 text-[#2B95FF] border border-[#2B95FF]/20 cursor-default' : 'bg-slate-900 hover:bg-black text-white'}"
                                            >
                                                {isCurrent 
                                                    ? (languageState.current === "ID" ? "Paket Aktif" : "Current Plan") 
                                                    : (languageState.current === "ID" ? "Pilih Paket" : "Select Plan")}
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Tab: Settings -->
                {#if activeTab === "settings"}
                    <div class="flex flex-col gap-6" in:fade={{ duration: 200 }}>
                        <div class="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-6">
                            
                            <h3 class="text-slate-900 text-lg font-bold border-b border-slate-100 pb-4">
                                {languageState.current === "ID" ? "Pengaturan Akun" : "Account Settings"}
                            </h3>

                            {#if saveSuccess}
                                <div class="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl text-sm font-medium flex items-center gap-2" transition:fade>
                                    <i class="ph-duotone ph-check-circle text-lg"></i>
                                    <span>{languageState.current === "ID" ? "Pengaturan profil berhasil disimpan!" : "Profile settings saved successfully!"}</span>
                                </div>
                            {/if}

                            <form onsubmit={handleSaveSettings} class="flex flex-col gap-5">
                                <!-- Name Input -->
                                <div class="flex flex-col gap-2">
                                    <label for="prof-name" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                        {languageState.current === "ID" ? "Nama Lengkap" : "Full Name"}
                                    </label>
                                    <input
                                        type="text"
                                        id="prof-name"
                                        bind:value={formName}
                                        class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] text-slate-900 rounded-2xl py-3.5 px-5 text-sm sm:text-base outline-none transition-all"
                                    />
                                </div>

                                <!-- Phone Input -->
                                <div class="flex flex-col gap-2">
                                    <label for="prof-phone" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                        {languageState.current === "ID" ? "Nomor Telepon" : "Phone Number"}
                                    </label>
                                    <input
                                        type="tel"
                                        id="prof-phone"
                                        bind:value={formPhone}
                                        class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] text-slate-900 rounded-2xl py-3.5 px-5 text-sm sm:text-base outline-none transition-all"
                                    />
                                </div>

                                <!-- Password Update -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    <div class="flex flex-col gap-2">
                                        <label for="prof-pass" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                            {languageState.current === "ID" ? "Password Saat Ini" : "Current Password"}
                                        </label>
                                        <input
                                            type="password"
                                            id="prof-pass"
                                            placeholder="••••••••"
                                            bind:value={formPassword}
                                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] text-slate-900 rounded-2xl py-3.5 px-5 text-sm outline-none transition-all placeholder-slate-400"
                                        />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="prof-npass" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                            {languageState.current === "ID" ? "Password Baru" : "New Password"}
                                        </label>
                                        <input
                                            type="password"
                                            id="prof-npass"
                                            placeholder="••••••••"
                                            bind:value={formNewPassword}
                                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] text-slate-900 rounded-2xl py-3.5 px-5 text-sm outline-none transition-all placeholder-slate-400"
                                        />
                                    </div>
                                </div>

                                <!-- Action Submit -->
                                <div class="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        class="bg-[#2B95FF] hover:bg-[#1a85f0] text-white font-semibold px-10 py-3.5 rounded-full transition-all text-sm cursor-pointer flex items-center gap-2"
                                    >
                                        <i class="ph-duotone ph-floppy-disk text-base"></i>
                                        <span>{languageState.current === "ID" ? "Simpan Perubahan" : "Save Changes"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                {/if}

            </div>

        </div>

    </div>
</div>

    {#if showTicketModal && selectedBookingForTicket}
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" transition:fade={{ duration: 150 }}>
            <!-- Modal Body (Printable area, NO shadows, flat border) -->
            <div class="bg-white border border-slate-200 rounded-[2rem] w-full max-w-md p-6 relative flex flex-col gap-6 print-ticket-area">
                
                <!-- Close Button (hidden in print) -->
                <button
                    onclick={() => showTicketModal = false}
                    class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors print:hidden cursor-pointer flex items-center justify-center border-none"
                    aria-label="Close"
                >
                    <i class="ph-duotone ph-x text-lg"></i>
                </button>

                <!-- Header -->
                <div class="text-center pb-4 border-b border-dashed border-slate-200">
                    <span class="text-xs font-bold text-[#2B95FF] uppercase tracking-widest">Padel Arena Booking Ticket</span>
                    <h3 class="text-slate-950 text-xl font-extrabold tracking-tight mt-1">{selectedBookingForTicket.court}</h3>
                </div>

                <!-- Ticket Details -->
                <div class="grid grid-cols-2 gap-y-4 text-sm">
                    <div class="flex flex-col">
                        <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">{languageState.current === "ID" ? "Tanggal" : "Date"}</span>
                        <span class="text-slate-800 font-semibold mt-0.5">{selectedBookingForTicket.date}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">{languageState.current === "ID" ? "Waktu" : "Time"}</span>
                        <span class="text-slate-800 font-semibold mt-0.5">{selectedBookingForTicket.time}</span>
                    </div>
                    <div class="flex flex-col col-span-2">
                        <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">{languageState.current === "ID" ? "Status Pembayaran" : "Payment Status"}</span>
                        <span class="mt-1">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold inline-block {selectedBookingForTicket.status === 'Paid' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600' : 'bg-[#FFA800]/10 border border-[#FFA800]/20 text-[#FFA800]'}">
                                {selectedBookingForTicket.status}
                            </span>
                        </span>
                    </div>
                    
                    {#if selectedBookingForTicket.addons && selectedBookingForTicket.addons.length > 0}
                        <div class="flex flex-col col-span-2">
                            <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Add-ons & Equipment</span>
                            <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                                {#each selectedBookingForTicket.addons as addon}
                                    <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-650 text-[10px] font-medium border border-slate-200/50">
                                        {addon}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    {/if}
                    
                    <div class="flex flex-col col-span-2 pt-3 border-t border-slate-100">
                        <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">{languageState.current === "ID" ? "Total Pembayaran" : "Total Amount"}</span>
                        <span class="text-slate-950 font-extrabold text-xl sm:text-2xl mt-0.5">Rp {selectedBookingForTicket.amount.toLocaleString("id-ID")}</span>
                    </div>
                </div>

                <!-- QR Code Area (Library Real QR Code, flat style) -->
                <div class="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    {#if qrCodeUrl}
                        <img 
                            src={qrCodeUrl} 
                            alt="QR Code" 
                            class="w-32 h-32 bg-white p-1 rounded-xl border border-slate-200" 
                        />
                    {:else}
                        <div class="w-32 h-32 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                            Generating...
                        </div>
                    {/if}
                    <span class="text-xs font-mono font-bold tracking-widest text-slate-800 mt-4">{selectedBookingForTicket.code}</span>
                </div>

                <!-- Print Action Button (hidden in print) -->
                <div class="flex justify-end gap-3 mt-2 print:hidden border-t border-slate-100 pt-4">
                    <button
                        onclick={() => showTicketModal = false}
                        class="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-full cursor-pointer transition-colors"
                    >
                        {languageState.current === "ID" ? "Tutup" : "Close"}
                    </button>
                    <button
                        onclick={() => window.print()}
                        class="bg-[#2B95FF] hover:bg-[#1a85f0] text-white text-xs font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-2"
                    >
                        <i class="ph-duotone ph-printer text-base"></i>
                        <span>{languageState.current === "ID" ? "Cetak Tiket" : "Print Ticket"}</span>
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <style>
        @media print {
            :global(body *) {
                visibility: hidden !important;
            }
            .print-ticket-area, .print-ticket-area * {
                visibility: visible !important;
            }
            .print-ticket-area {
                position: absolute !important;
                left: 50% !important;
                top: 5% !important;
                transform: translateX(-50%) !important;
                width: 100% !important;
                max-width: 450px !important;
                border: none !important;
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        }
    </style>

<Footer />
{/if}

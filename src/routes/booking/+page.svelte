<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";

    import { onMount } from "svelte";

    let { data } = $props();

    // Booking state
    let step = $state(1); // 1: Court, 2: Date & Time, 3: Payment, 4: Success
    
    // Step 1: Selected Court
    let selectedCourt = $state("");
    
    const defaultCourts = [
        {
            id: "court-1",
            name: "Court Alpha (Indoor)",
            type: "Indoor",
            desc: "Lapangan indoor ber-AC dengan karpet khusus World Padel Tour, minim terpaan angin dan pencahayaan optimal.",
            descEN: "Air-conditioned indoor court with World Padel Tour carpet, minimal wind disturbance and optimal lighting.",
            price: 180000,
            image: "/images/images/lesson-card.webp"
        },
        {
            id: "court-2",
            name: "Court Beta (Outdoor)",
            type: "Outdoor",
            desc: "Lapangan outdoor premium dengan sirkulasi udara alami yang segar. Nikmati sensasi bermain padel di bawah langit terbuka.",
            descEN: "Premium outdoor court with fresh natural air. Enjoy the sensation of playing padel under the open sky.",
            price: 130000,
            image: "/images/images/practice-card.webp"
        },
        {
            id: "court-3",
            name: "Court Arena (Championship)",
            type: "Indoor/Pro",
            desc: "Lapangan utama untuk turnamen, dilengkapi tribun penonton mini, sistem video-replay, dan pencahayaan profesional.",
            descEN: "Main tournament court equipped with a mini spectator stand, video-replay system, and professional lighting.",
            price: 220000,
            image: "/images/images/hero-image.webp"
        }
    ];

    let courts = $state<any[]>(defaultCourts);

    onMount(() => {
        if (data && data.dbSuccess && data.dbCourts) {
            courts = data.dbCourts;
        } else {
            try {
                const saved = localStorage.getItem("custom_courts");
                if (saved) {
                    courts = JSON.parse(saved);
                } else {
                    localStorage.setItem("custom_courts", JSON.stringify(defaultCourts));
                }
            } catch (_) {}
        }

        // Check for URL parameters to prefill selections
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("coach") === "true") {
                addonCoach = true;
            }
            const paramCourt = params.get("court");
            if (paramCourt) {
                selectedCourt = paramCourt;
                step = 2; // skip step 1 to select date
            }
        } catch (_) {}
    });

    // Step 2: Date & Time
    let selectedDateIndex = $state(0);
    let selectedTimeSlots = $state<string[]>([]);
    
    // Generate next 7 days for booking calendar
    const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const daysOfWeekEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const bookingDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: daysOfWeek[d.getDay()],
            dayEN: daysOfWeekEN[d.getDay()],
            date: d.getDate(),
            month: d.toLocaleString(languageState.current === "ID" ? "id-ID" : "en-US", { month: "short" }),
            fullDateString: d.toISOString().split("T")[0]
        };
    });

    // Available operational time slots
    const timeSlots = [
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
        "18:00", "19:00", "20:00", "21:00", "22:00"
    ];

    const mockBookedSlots: Record<string, string[]> = {
        "court-1": ["06:00", "08:00", "18:00", "19:00", "20:00"],
        "court-2": ["07:00", "10:00", "15:00", "16:00", "19:00"],
        "court-3": ["08:00", "09:00", "17:00", "20:00", "21:00"]
    };

    function isSlotBooked(courtId: string, time: string) {
        const list = mockBookedSlots[courtId] || [];
        const offset = selectedDateIndex % 3;
        if (offset === 1 && time === "10:00") return true;
        if (offset === 2 && time === "14:00") return true;
        return list.includes(time);
    }

    function toggleTimeSlot(time: string) {
        if (selectedTimeSlots.includes(time)) {
            selectedTimeSlots = selectedTimeSlots.filter(t => t !== time);
        } else {
            selectedTimeSlots = [...selectedTimeSlots, time].sort();
        }
    }

    // Step 3: Payment Method
    let selectedPayment = $state("");
    const paymentMethods = [
        { id: "qris", name: "QRIS / GoPay / OVO", icon: "lightning" },
        { id: "va-bca", name: "BCA Virtual Account", icon: "bank" },
        { id: "va-mandiri", name: "Mandiri Virtual Account", icon: "bank" },
        { id: "cc", name: "Credit Card / Visa / Mastercard", icon: "credit-card" }
    ];

    // Calculated pricing
    const courtPrice = $derived(courts.find(c => c.id === selectedCourt)?.price || 0);
    const totalHours = $derived(selectedTimeSlots.length);
    const subtotal = $derived(courtPrice * totalHours);
    const serviceFee = $derived(totalHours > 0 ? 5000 : 0);

    // Addon States
    let addonRacket = $state(false);
    let addonBalls = $state(false);
    let addonCoach = $state(false);
    let generatedBookingCode = $state("PADEL-78A9C");

    const addonRacketCost = $derived(addonRacket ? 40000 : 0);
    const addonBallsCost = $derived(addonBalls ? 50000 : 0);
    const addonCoachCost = $derived(addonCoach ? 150000 * totalHours : 0);
    const totalAddonsCost = $derived(addonRacketCost + addonBallsCost + addonCoachCost);
    const grandTotal = $derived(subtotal + serviceFee + totalAddonsCost);

    let isSubmitting = $state(false);

    function handleCheckout() {
        if (!selectedPayment) return;
        isSubmitting = true;
        
        setTimeout(() => {
            isSubmitting = false;
            
            // Save to localStorage so it reflects in profile and admin panel!
            try {
                const courtObj = courts.find(c => c.id === selectedCourt);
                const selectedDate = bookingDates[selectedDateIndex];
                const dateStr = selectedDate ? selectedDate.fullDateString : "2026-07-09";
                const timeStr = selectedTimeSlots.join(", ");
                const bookingCode = "PADEL-" + Math.random().toString(36).substring(2, 7).toUpperCase();
                generatedBookingCode = bookingCode;
                
                // Construct add-on labels
                const addOnList: string[] = [];
                if (addonRacket) addOnList.push("Racket Rental");
                if (addonBalls) addOnList.push("Padel Balls");
                if (addonCoach) addOnList.push("Coach Hire");

                const newBooking = {
                    id: "BK-" + Math.floor(100 + Math.random() * 900),
                    name: "Fauzi Anwar", // default logged in user
                    court: courtObj ? courtObj.name : "Court Alpha (Indoor)",
                    date: dateStr,
                    time: timeStr,
                    amount: grandTotal,
                    status: "Paid",
                    code: bookingCode,
                    addons: addOnList
                };
                
                // Add to client profile bookings
                const savedProfileBookings = JSON.parse(localStorage.getItem("custom_profile_bookings") || "[]");
                savedProfileBookings.unshift(newBooking);
                localStorage.setItem("custom_profile_bookings", JSON.stringify(savedProfileBookings));
                
                // Add to admin bookings
                const savedAdminBookings = JSON.parse(localStorage.getItem("custom_admin_bookings") || "[]");
                savedAdminBookings.unshift(newBooking);
                localStorage.setItem("custom_admin_bookings", JSON.stringify(savedAdminBookings));
                
                // Sync to Neon Database
                const formData = new FormData();
                formData.append('id', newBooking.id);
                formData.append('memberName', newBooking.name);
                formData.append('courtName', newBooking.court);
                formData.append('date', newBooking.date);
                formData.append('time', newBooking.time);
                formData.append('amount', newBooking.amount.toString());
                formData.append('code', newBooking.code);
                formData.append('status', newBooking.status);
                formData.append('addons', JSON.stringify(newBooking.addons));

                fetch('?/createBooking', {
                    method: 'POST',
                    body: formData
                }).catch(err => console.error("Database sync failed:", err));
                
            } catch (_) {}

            step = 4; // Show success step
        }, 2000);
    }

    function resetBooking() {
        step = 1;
        selectedCourt = "";
        selectedTimeSlots = [];
        selectedPayment = "";
        addonRacket = false;
        addonBalls = false;
        addonCoach = false;
    }
</script>

<Navbar />

<div class="relative min-h-[calc(100vh-100px)] w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-600 overflow-x-hidden">
    <!-- Visual background gradient highlights (subtle & soft) -->
    <div class="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#2B95FF]/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#FFA800]/3 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-4xl mx-auto z-10 relative">
        <!-- Progress Steps Header -->
        {#if step < 4}
            <div class="flex items-center justify-between mb-12 px-4">
                <div class="flex flex-col items-center gap-2">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all {step >= 1 ? 'bg-[#2B95FF] text-white' : 'bg-slate-200 text-slate-400 border border-slate-200' }">1</div>
                    <span class="text-xs font-semibold {step >= 1 ? 'text-slate-900' : 'text-slate-400'}">
                        {languageState.current === "ID" ? "Pilih Lapangan" : "Select Court"}
                    </span>
                </div>
                <div class="h-0.5 flex-grow mx-4 bg-slate-200 relative">
                    <div class="absolute inset-0 bg-[#2B95FF] transition-all duration-500" style="width: {step > 1 ? '100%' : '0%'}"></div>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all {step >= 2 ? 'bg-[#2B95FF] text-white' : 'bg-slate-200 text-slate-400 border border-slate-200' }">2</div>
                    <span class="text-xs font-semibold {step >= 2 ? 'text-slate-900' : 'text-slate-400'}">
                        {languageState.current === "ID" ? "Tanggal & Jam" : "Date & Time"}
                    </span>
                </div>
                <div class="h-0.5 flex-grow mx-4 bg-slate-200 relative">
                    <div class="absolute inset-0 bg-[#2B95FF] transition-all duration-500" style="width: {step > 2 ? '100%' : '0%'}"></div>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all {step >= 3 ? 'bg-[#2B95FF] text-white' : 'bg-slate-200 text-slate-400 border border-slate-200' }">3</div>
                    <span class="text-xs font-semibold {step >= 3 ? 'text-slate-900' : 'text-slate-400'}">
                        {languageState.current === "ID" ? "Pembayaran" : "Payment"}
                    </span>
                </div>
            </div>
        {/if}

        <!-- Step 1: Select Court -->
        {#if step === 1}
            <div class="flex flex-col gap-8" in:fade={{ duration: 300 }}>
                <div class="text-center md:text-left">
                    <h1 class="text-slate-900 text-3xl font-semibold tracking-tight mb-2">
                        {languageState.current === "ID" ? "Pilih Lapangan Padel" : "Select Padel Court"}
                    </h1>
                    <p class="text-slate-500 font-light text-sm md:text-base">
                        {languageState.current === "ID" ? "Pilih salah satu tipe lapangan premium terbaik kami di bawah ini." : "Select one of our premium court types below."}
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {#each courts as court}
                        {@const isMaintenance = court.status === 'Maintenance'}
                        <button
                            onclick={() => { if (!isMaintenance) selectedCourt = court.id; }}
                            disabled={isMaintenance}
                            class="bg-white border text-left overflow-hidden rounded-[2.5rem] flex flex-col group transition-all duration-300 hover:-translate-y-1 {isMaintenance ? 'opacity-65 cursor-not-allowed border-slate-200' : 'cursor-pointer'} {selectedCourt === court.id ? 'border-[#2B95FF] ring-2 ring-[#2B95FF]/10' : 'border-slate-200'}"
                        >
                            <div class="h-48 w-full overflow-hidden relative bg-slate-100">
                                <img src={court.image} alt={court.name} class="w-full h-full object-cover transform transition-transform duration-500 {!isMaintenance ? 'group-hover:scale-105' : ''}" />
                                <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-white">
                                    {court.type}
                                </div>
                                {#if isMaintenance}
                                    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                        <div class="bg-rose-50 border border-rose-200 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                                            <i class="ph-duotone ph-warning-circle text-base"></i>
                                            <span>Under Maintenance</span>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                            <div class="p-6 flex-grow flex flex-col justify-between gap-4">
                                <div class="flex flex-col gap-2">
                                    <h3 class="text-slate-900 text-lg font-semibold {!isMaintenance ? 'group-hover:text-[#2B95FF]' : ''} transition-colors">{court.name}</h3>
                                    <p class="text-slate-500 text-xs font-light leading-relaxed">
                                        {languageState.current === "ID" ? court.desc : court.descEN}
                                    </p>
                                </div>
                                <div class="flex items-baseline justify-between border-t border-slate-100 pt-4 mt-auto">
                                    <span class="text-slate-400 text-xs font-light">Price/Hour</span>
                                    <span class="text-slate-900 font-semibold text-lg">
                                        Rp {court.price.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>

                <div class="flex justify-end mt-4">
                    <button
                        onclick={() => step = 2}
                        disabled={!selectedCourt}
                        class="bg-[#2B95FF] hover:bg-[#1a85f0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium px-10 py-3.5 rounded-full transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
                    >
                        {languageState.current === "ID" ? "Lanjutkan" : "Next Step"}
                    </button>
                </div>
            </div>
        {/if}

        <!-- Step 2: Date & Time -->
        {#if step === 2}
            <div class="flex flex-col gap-8" in:fade={{ duration: 300 }}>
                <div class="flex items-center gap-4 border-b border-slate-200 pb-4">
                    <button onclick={() => step = 1} class="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-sm font-semibold flex items-center gap-2">
                        <i class="ph-duotone ph-arrow-left text-base"></i>
                        <span>{languageState.current === "ID" ? "Kembali" : "Back"}</span>
                    </button>
                    <h1 class="text-slate-900 text-2xl font-semibold tracking-tight">
                        {languageState.current === "ID" ? "Pilih Tanggal & Waktu" : "Select Date & Time"}
                    </h1>
                </div>

                <!-- Date Slider -->
                <div class="flex flex-col gap-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {languageState.current === "ID" ? "Pilih Tanggal" : "Choose Date"}
                    </span>
                    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {#each bookingDates as bDate, idx}
                            <button
                                onclick={() => { selectedDateIndex = idx; selectedTimeSlots = []; }}
                                   class="flex-shrink-0 w-24 py-4 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer {selectedDateIndex === idx ? 'bg-[#2B95FF] border-[#2B95FF] text-white' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'}"
                            >
                                <span class="text-[10px] font-semibold uppercase tracking-wider">{languageState.current === "ID" ? bDate.day : bDate.dayEN}</span>
                                <span class="text-xl font-bold tracking-tight">{bDate.date}</span>
                                <span class="text-xs font-light">{bDate.month}</span>
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Time Grid -->
                <div class="flex flex-col gap-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {languageState.current === "ID" ? "Pilih Waktu (Maksimal beberapa jam)" : "Choose Time (Multiple slots allowed)"}
                    </span>
                    <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {#each timeSlots as slot}
                            {@const booked = isSlotBooked(selectedCourt, slot)}
                            {@const selected = selectedTimeSlots.includes(slot)}
                            <button
                                onclick={() => toggleTimeSlot(slot)}
                                disabled={booked}
                                class="py-3.5 rounded-xl border text-center transition-all cursor-pointer text-sm font-medium {booked ? 'bg-rose-5 border-rose-100 text-rose-300 line-through cursor-not-allowed' : selected ? 'bg-[#2B95FF] border-[#2B95FF] text-white' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'}"
                            >
                                {slot}
                                {#if booked}
                                    <span class="block text-[8px] tracking-normal font-semibold mt-0.5 opacity-60">Booked</span>
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Add-ons Selector -->
                <div class="flex flex-col gap-4 border-t border-slate-100 pt-6">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {languageState.current === "ID" ? "Layanan Tambahan (Opsional)" : "Optional Add-ons"}
                    </span>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <!-- Racket Rental -->
                        <div class="bg-white border border-slate-200 p-5 rounded-[1.5rem] flex flex-col justify-between gap-4">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 rounded-xl bg-[#2B95FF]/5 text-[#2B95FF] flex items-center justify-center shrink-0">
                                    <i class="ph-duotone ph-tennis-ball text-xl"></i>
                                </div>
                                <div class="flex flex-col gap-0.5">
                                    <h4 class="text-slate-900 text-sm font-semibold">{languageState.current === "ID" ? "Sewa Raket" : "Rent Racket"}</h4>
                                    <p class="text-slate-500 text-[11px] font-light leading-relaxed">
                                        {languageState.current === "ID" ? "Raket Padel pro serat karbon." : "Pro carbon-fiber padel racket."}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between border-t border-slate-50 pt-3">
                                <span class="text-slate-900 font-bold text-xs font-mono">Rp 40.000 / {languageState.current === "ID" ? "pcs" : "unit"}</span>
                                <input
                                    type="checkbox"
                                    bind:checked={addonRacket}
                                    class="w-5 h-5 rounded-lg border-slate-300 text-[#2B95FF] focus:ring-[#2B95FF] cursor-pointer"
                                />
                            </div>
                        </div>

                        <!-- Padel Balls -->
                        <div class="bg-white border border-slate-200 p-5 rounded-[1.5rem] flex flex-col justify-between gap-4">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 rounded-xl bg-[#FFA800]/5 text-[#FFA800] flex items-center justify-center shrink-0">
                                    <i class="ph-duotone ph-circles-three text-xl"></i>
                                </div>
                                <div class="flex flex-col gap-0.5">
                                    <h4 class="text-slate-900 text-sm font-semibold">{languageState.current === "ID" ? "Beli Bola Padel" : "Padel Balls"}</h4>
                                    <p class="text-slate-500 text-[11px] font-light leading-relaxed">
                                        {languageState.current === "ID" ? "1 tabung isi 3 bola Padel baru." : "1 can containing 3 fresh padel balls."}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between border-t border-slate-50 pt-3">
                                <span class="text-slate-900 font-bold text-xs font-mono">Rp 50.000 / {languageState.current === "ID" ? "tabung" : "can"}</span>
                                <input
                                    type="checkbox"
                                    bind:checked={addonBalls}
                                    class="w-5 h-5 rounded-lg border-slate-300 text-[#2B95FF] focus:ring-[#2B95FF] cursor-pointer"
                                />
                            </div>
                        </div>

                        <!-- Private Coach -->
                        <div class="bg-white border border-slate-200 p-5 rounded-[1.5rem] flex flex-col justify-between gap-4">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <i class="ph-duotone ph-user-focus text-xl"></i>
                                </div>
                                <div class="flex flex-col gap-0.5">
                                    <h4 class="text-slate-900 text-sm font-semibold">{languageState.current === "ID" ? "Sewa Coach" : "Hire Coach"}</h4>
                                    <p class="text-slate-500 text-[11px] font-light leading-relaxed">
                                        {languageState.current === "ID" ? "Pelatih profesional pribadi." : "Private professional coach."}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between border-t border-slate-50 pt-3">
                                <span class="text-slate-900 font-bold text-xs font-mono">Rp 150.000 / {languageState.current === "ID" ? "jam" : "hr"}</span>
                                <input
                                    type="checkbox"
                                    bind:checked={addonCoach}
                                    class="w-5 h-5 rounded-lg border-slate-300 text-[#2B95FF] focus:ring-[#2B95FF] cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Booking Summary Bar -->
                {#if selectedTimeSlots.length > 0}
                    <div class="bg-[#2B95FF]/5 border border-[#2B95FF]/20 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4" transition:slide>
                        <div class="text-center sm:text-left">
                            <h4 class="text-slate-900 text-base font-semibold">
                                {courts.find(c => c.id === selectedCourt)?.name}
                            </h4>
                            <p class="text-slate-500 text-xs font-light mt-1">
                                {bookingDates[selectedDateIndex].day}, {bookingDates[selectedDateIndex].date} {bookingDates[selectedDateIndex].month} &bull; {selectedTimeSlots.length} Jam ({selectedTimeSlots.join(", ")})
                            </p>
                        </div>
                        <div class="text-center sm:text-right">
                            <span class="text-slate-400 text-xs block font-light">Subtotal</span>
                            <span class="text-[#2B95FF] text-xl font-bold">
                                Rp {grandTotal.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                {/if}

                <div class="flex justify-end gap-4 mt-4">
                    <button
                        onclick={() => step = 3}
                        disabled={selectedTimeSlots.length === 0}
                        class="bg-[#2B95FF] hover:bg-[#1a85f0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium px-10 py-3.5 rounded-full transition-all text-sm cursor-pointer disabled:cursor-not-allowed"
                    >
                        {languageState.current === "ID" ? "Lanjutkan ke Pembayaran" : "Continue to Payment"}
                    </button>
                </div>
            </div>
        {/if}

        <!-- Step 3: Checkout & Payment -->
        {#if step === 3}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8" in:fade={{ duration: 300 }}>
                <!-- Payment methods column -->
                <div class="md:col-span-2 flex flex-col gap-8">
                    <div class="flex items-center gap-4 border-b border-slate-200 pb-4">
                        <button onclick={() => step = 2} class="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-sm font-semibold flex items-center gap-2">
                            <i class="ph-duotone ph-arrow-left text-base"></i>
                            <span>{languageState.current === "ID" ? "Kembali" : "Back"}</span>
                        </button>
                        <h1 class="text-slate-900 text-2xl font-semibold tracking-tight">
                            {languageState.current === "ID" ? "Metode Pembayaran" : "Payment Method"}
                        </h1>
                    </div>

                    <div class="flex flex-col gap-4">
                        {#each paymentMethods as pm}
                            <button
                                onclick={() => selectedPayment = pm.id}
                                class="w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer {selectedPayment === pm.id ? 'border-[#2B95FF] bg-[#2B95FF]/5' : 'bg-white border-slate-200 hover:border-slate-300'}"
                            >
                                <div class="flex items-center gap-4">
                                    <i class="ph-duotone ph-{pm.icon} text-2xl text-[#2B95FF]"></i>
                                    <span class="text-slate-800 text-sm sm:text-base font-medium">{pm.name}</span>
                                </div>
                                <div class="w-5 h-5 rounded-full border flex items-center justify-center {selectedPayment === pm.id ? 'border-[#2B95FF]' : 'border-slate-300'}">
                                    {#if selectedPayment === pm.id}
                                        <div class="w-2.5 h-2.5 rounded-full bg-[#2B95FF]"></div>
                                    {/if}
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Summary Sidebar -->
                <div class="bg-white border border-slate-200 rounded-[2.5rem] p-6 flex flex-col gap-6 h-fit">
                    <h3 class="text-slate-900 text-lg font-semibold border-b border-slate-100 pb-4">
                        {languageState.current === "ID" ? "Ringkasan Booking" : "Booking Summary"}
                    </h3>

                    <!-- Details -->
                    <div class="flex flex-col gap-4 text-xs sm:text-sm font-light text-slate-500">
                        <div class="flex flex-col gap-1 border-b border-slate-100 pb-3">
                            <span class="text-slate-400 font-semibold">Lapangan</span>
                            <span class="text-slate-900 font-medium">{courts.find(c => c.id === selectedCourt)?.name}</span>
                        </div>
                        <div class="flex flex-col gap-1 border-b border-slate-100 pb-3">
                            <span class="text-slate-400 font-semibold">Waktu</span>
                            <span class="text-slate-900 font-medium font-sans">
                                {bookingDates[selectedDateIndex].day}, {bookingDates[selectedDateIndex].date} {bookingDates[selectedDateIndex].month} <br/>
                                ({selectedTimeSlots.length} Jam) &bull; {selectedTimeSlots.join(", ")}
                            </span>
                        </div>
                        
                        <!-- Pricing Details -->
                        <div class="flex flex-col gap-2 mt-2">
                            <div class="flex justify-between">
                                <span>Sewa Lapangan ({totalHours} Jam)</span>
                                <span class="text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
                            </div>
                            {#if addonRacket}
                                <div class="flex justify-between text-xs">
                                    <span>+ Sewa Raket Pro</span>
                                    <span class="text-slate-800">Rp {addonRacketCost.toLocaleString("id-ID")}</span>
                                </div>
                            {/if}
                            {#if addonBalls}
                                <div class="flex justify-between text-xs">
                                    <span>+ Bola Padel</span>
                                    <span class="text-slate-800">Rp {addonBallsCost.toLocaleString("id-ID")}</span>
                                </div>
                            {/if}
                            {#if addonCoach}
                                <div class="flex justify-between text-xs">
                                    <span>+ Jasa Pelatih ({totalHours} Jam)</span>
                                    <span class="text-slate-800">Rp {addonCoachCost.toLocaleString("id-ID")}</span>
                                </div>
                            {/if}
                            <div class="flex justify-between">
                                <span>Biaya Layanan</span>
                                <span class="text-slate-800">Rp {serviceFee.toLocaleString("id-ID")}</span>
                            </div>
                            <div class="flex justify-between border-t border-slate-100 pt-4 mt-2 text-base font-semibold">
                                <span class="text-slate-950">Total</span>
                                <span class="text-[#2B95FF] font-bold">Rp {grandTotal.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Checkout CTA -->
                    <button
                        onclick={handleCheckout}
                        disabled={!selectedPayment || isSubmitting}
                        class="w-full bg-[#2B95FF] hover:bg-[#1a85f0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3.5 rounded-full transition-all text-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {#if isSubmitting}
                            <i class="ph-duotone ph-circle-notch animate-spin text-lg"></i>
                            {languageState.current === "ID" ? "Memproses..." : "Processing..."}
                        {:else}
                            {languageState.current === "ID" ? "Bayar Sekarang" : "Pay Now"}
                        {/if}
                    </button>
                </div>
            </div>
        {/if}

        <!-- Step 4: Success Screen -->
        {#if step === 4}
            <div class="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center max-w-xl mx-auto flex flex-col items-center gap-6" in:fade={{ duration: 300 }}>
                <div class="w-20 h-20 bg-emerald-50 border border-emerald-250 rounded-full flex items-center justify-center text-emerald-600 mb-2 animate-bounce">
                    <i class="ph-duotone ph-check-circle text-4xl"></i>
                </div>
                <h1 class="text-slate-900 text-3xl font-semibold tracking-tight">
                    {languageState.current === "ID" ? "Booking Berhasil!" : "Booking Successful!"}
                </h1>
                <p class="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
                    {languageState.current === "ID" 
                        ? "Pembayaran Anda telah diterima. Kode booking telah dikirimkan ke email Anda. Silakan tunjukkan kode booking ini saat tiba di lokasi."
                        : "Your payment has been received. The booking code has been sent to your email. Please show this booking code when arriving at the location."}
                </p>

                <!-- Mock Booking Code Card -->
                <div class="bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 w-full max-w-xs my-2">
                    <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-1">Booking Code</span>
                    <span class="text-slate-900 text-2xl font-bold tracking-widest">{generatedBookingCode}</span>
                </div>

                <div class="flex gap-4 mt-2">
                    <a href="/" class="border border-slate-200 hover:border-slate-350 text-slate-700 font-medium px-8 py-3.5 rounded-full transition-all text-sm bg-white">
                        {languageState.current === "ID" ? "Kembali ke Beranda" : "Go to Homepage"}
                    </a>
                    <button onclick={resetBooking} class="bg-[#2B95FF] hover:bg-[#1a85f0] text-white font-medium px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer">
                        {languageState.current === "ID" ? "Booking Lagi" : "Book Another Court"}
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<Footer />

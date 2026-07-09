<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";

    let activePlan = $state("pro");

    const defaultPlans = [
        {
            id: "pro",
            name: "Pro Membership",
            price: "Rp 1.800.000",
            priceEN: "$120",
            features: [
                "Kelas grup tanpa batas",
                "Prioritas booking lapangan",
                "4 sesi latihan privat",
                "Akses semua turnamen klub",
            ],
            featuresEN: [
                "Unlimited group classes",
                "Priority booking",
                "4 private lessons",
                "All tournament access",
            ],
            isPopular: true,
            badge: "Pilihan Utama",
            badgeEN: "Most Popular Plan",
        },
        {
            id: "elite",
            name: "Elite Plan",
            price: "Rp 3.000.000",
            priceEN: "$200",
            features: [
                "8 kelas grup per bulan",
                "4 jam sewa lapangan gratis",
                "2 sesi latihan privat",
                "Akses turnamen internal klub",
            ],
            featuresEN: [
                "8 group classes",
                "4 court hours",
                "2 private lessons",
                "Club tournament access",
            ],
            isPopular: false,
        },
        {
            id: "basic",
            name: "Basic Plan",
            price: "Rp 1.200.000",
            priceEN: "$80",
            features: [
                "4 kelas grup per bulan",
                "2 jam sewa lapangan gratis",
                "Sudah termasuk pinjaman raket & bola",
            ],
            featuresEN: [
                "4 group classes",
                "2 court hours",
                "Equipment rental included",
            ],
            isPopular: false,
        },
    ];

    let plans = $state(defaultPlans);

    onMount(() => {
        try {
            const saved = localStorage.getItem("custom_plans");
            if (saved) {
                plans = JSON.parse(saved);
                if (plans.length > 0 && !plans.some(p => p.id === activePlan)) {
                    activePlan = plans[0].id;
                }
            } else {
                localStorage.setItem("custom_plans", JSON.stringify(defaultPlans));
            }
        } catch (_) {}
    });
</script>

<section
    id="membership"
    class="w-full bg-[#F4F9FF] rounded-[2.5rem] sm:rounded-[4rem] pt-12 pb-12 md:pt-20 md:pb-20"
>
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Main Layout (Reordered on mobile to have Title on top) -->
        <div
            class="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-16 items-start"
        >
            <!-- Badge & Title (Always on top now) -->
            <div
                class="w-full flex flex-col items-start gap-4 lg:sticky lg:top-24 h-fit lg:col-span-2"
            >
                <div
                    class="inline-block px-5 py-2 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-500 tracking-wider bg-white"
                >
                    {languageState.current === "ID" ? "Keanggotaan" : "Memberships"}
                </div>

                <div class="max-w-xl">
                    <h2
                        class="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-slate-900 mb-4"
                    >
                        {languageState.current === "ID" 
                            ? "Tiga pilihan membership untuk meningkatkan kualitas permainanmu." 
                            : "Three membership options to improve your game quality."}
                    </h2>
                    <p class="text-slate-500 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
                        {languageState.current === "ID" 
                            ? "Manfaat eksklusif. Pengalaman premium. Satu pilihan yang tepat." 
                            : "Exclusive benefits. Premium experience. One right choice."}
                    </p>
                </div>
            </div>

            <!-- Right Column: Membership Cards List -->
            <div
                class="flex flex-col gap-4 sm:gap-6 lg:col-span-3 w-full"
            >
                {#each plans as plan}
                    <!-- Card Container -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="rounded-[2rem] transition-all duration-500 ease-in-out cursor-pointer overflow-hidden w-full flex flex-col justify-center
                        {activePlan === plan.id
                            ? 'bg-[#2B95FF] text-white p-6 sm:p-10'
                            : 'bg-white text-slate-800 p-5 sm:p-8 border border-slate-100 hover:border-[#2B95FF]/30'}"
                        onclick={() => (activePlan = plan.id)}
                    >
                        {#if activePlan === plan.id}
                            <!-- EXPANDED STATE (Active) -->
                            <div
                                class="flex flex-col h-full justify-between gap-6 sm:gap-8 w-full"
                                transition:slide={{ duration: 400 }}
                            >
                                <!-- Top Section -->
                                <div
                                    class="flex flex-row justify-between items-center gap-4"
                                >
                                    {#if plan.isPopular}
                                        <div
                                            class="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-bold text-white tracking-wide border border-white/25"
                                        >
                                            {languageState.current === "ID" ? plan.badge : plan.badgeEN}
                                        </div>
                                    {:else}
                                        <div></div>
                                    {/if}
                                    <div class="flex items-baseline shrink-0">
                                        <span
                                            class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
                                            >{languageState.current === "ID" ? plan.price : plan.priceEN}</span
                                        >
                                        <span
                                            class="text-white/80 text-xs sm:text-sm font-light ml-1"
                                            >/{languageState.current === "ID" ? "bln" : "mo"}</span
                                        >
                                    </div>
                                </div>

                                <!-- Title & Features -->
                                <div class="flex flex-col gap-4">
                                    <h3
                                        class="text-2xl sm:text-3xl font-bold tracking-tight"
                                    >
                                        {plan.name}
                                    </h3>

                                    <div class="flex flex-col gap-2.5 sm:gap-3.5 mt-2">
                                        {#each (languageState.current === "ID" ? plan.features : plan.featuresEN) as feature}
                                            <div class="flex items-start gap-2.5 text-xs sm:text-sm font-light">
                                                <i class="ph-duotone ph-check-circle text-base sm:text-lg text-white shrink-0 mt-0.5"></i>
                                                <span class="leading-snug">{feature}</span>
                                            </div>
                                        {/each}
                                    </div>
                                </div>

                                <!-- CTA Button -->
                                <div class="mt-2">
                                    <a
                                        href="/register"
                                        class="bg-slate-900 text-white px-8 py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-black transition-all inline-flex items-center gap-1.5 group cursor-pointer"
                                    >
                                        <span>{languageState.current === "ID" ? "Pilih Plan" : "Choose Plan"}</span>
                                        <i class="ph-duotone ph-arrow-up-right text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
                                    </a>
                                </div>
                            </div>
                        {:else}
                            <!-- COLLAPSED STATE (Inactive) -->
                            <div
                                class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                transition:slide={{ duration: 400 }}
                            >
                                <h3
                                    class="text-lg sm:text-xl font-bold text-slate-800"
                                >
                                    {plan.name}
                                </h3>
                                <button
                                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer"
                                >
                                    <span>{languageState.current === "ID" ? "Lihat Fitur" : "View Features"}</span>
                                    <i class="ph-duotone ph-caret-down text-[10px] sm:text-xs"></i>
                                </button>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

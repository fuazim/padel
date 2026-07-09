<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { languageState } from "$lib/state.svelte";

    let isTournamentMode = $state(false);
    let lessonImgLoaded = $state(false);

    // Content for switcher
    const modes = {
        standard: {
            label: "Casual Mode",
            desc: "Lapangan padel berstandar profesional dengan sistem pencahayaan turnamen memastikan kualitas permainan tetap optimal kapan pun Anda bermain.",
            descEN: "Professional standard padel courts with tournament lighting systems ensure optimal play quality whenever you play."
        },
        tournament: {
            label: "Tournament Mode",
            desc: "Pencahayaan intensitas tinggi dan setup lapangan resmi standar World Padel Tour untuk pengalaman kompetisi sesungguhnya.",
            descEN: "High-intensity lighting and official World Padel Tour court setup for a true competitive experience."
        },
    };

    // Stats Interaction
    let statsSection: HTMLElement;
    const stats = [
        { value: 12000, label: "Jam bermain setiap tahun", labelEN: "Hours played annually", suffix: "+" },
        { value: 89, label: "Tingkat retensi member", labelEN: "Member retention rate", suffix: "%" },
        { value: 1200, label: "Member aktif", labelEN: "Active club members", suffix: "+" },
        { value: 125, label: "Turnamen & event setiap tahun", labelEN: "Tournaments & events yearly", suffix: "+" },
    ];

    const statsValues = tweened(
        stats.map(() => 0),
        {
            duration: 2000,
            easing: cubicOut,
        },
    );

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        statsValues.set(stats.map((s) => s.value));
                    } else {
                        statsValues.set(
                            stats.map(() => 0),
                            { duration: 0 },
                        );
                    }
                });
            },
            { threshold: 0.2 },
        );

        if (statsSection) observer.observe(statsSection);

        return () => observer.disconnect();
    });
</script>

<section
    id="about"
    class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-20"
>
    <div class="flex flex-col gap-8 md:gap-12">
        <!-- Row 1: Header Badge & Description -->
        <div
            class="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8"
        >
            <div
                class="px-5 py-2 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-500 tracking-wider flex-shrink-0"
            >
                {languageState.current === "ID" ? "Tentang Kami" : "About Us"}
            </div>

            <h2
                class="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-slate-900 max-w-4xl lg:text-right"
            >
                {languageState.current === "ID" 
                    ? "Sejak 2021 Padel hadir sebagai tempat berlatih dan berkembang bagi para pemain pemula hingga atlet berpengalaman." 
                    : "Since 2021 Padel is here as a place to practice and grow for beginner players to experienced athletes."}
            </h2>
        </div>

        <!-- Row 2: Cards Grid -->
        <div
            class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-[480px]"
        >
            <!-- Card 1: Features (Black) -->
            <div
                class="bg-slate-950 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[380px] sm:min-h-[450px] lg:min-h-auto"
            >
                <div class="z-10 flex flex-col gap-6">
                    <div class="w-12 h-12 text-white shrink-0">
                        <img
                            src="/images/icons/padel-court.svg"
                            alt="Padel Court"
                            class="w-full h-full invert brightness-0 filter"
                        />
                    </div>

                    <div class="min-h-[120px]">
                        {#key isTournamentMode}
                            <p
                                class="text-xl sm:text-2xl lg:text-3xl font-normal leading-snug text-white"
                                in:fade={{ duration: 200 }}
                            >
                                {languageState.current === "ID"
                                    ? (isTournamentMode ? modes.tournament.desc : modes.standard.desc)
                                    : (isTournamentMode ? modes.tournament.descEN : modes.standard.descEN)}
                            </p>
                        {/key}
                    </div>
                </div>

                <div class="z-10 mt-6 flex items-center gap-4">
                    <!-- Toggle Switch -->
                    <button
                        class="w-14 h-8 rounded-full bg-[#2B95FF] p-1 flex items-center transition-colors duration-300 relative focus:outline-none cursor-pointer"
                        onclick={() => (isTournamentMode = !isTournamentMode)}
                        aria-label="Toggle game mode"
                    >
                        <div
                            class="w-6 h-6 bg-white rounded-full transform transition-transform duration-300 ease-in-out"
                            style="transform: translateX({isTournamentMode ? '24px' : '0px'})"
                        ></div>
                    </button>
                    <!-- Label next to toggle -->
                    <span class="text-sm font-semibold text-slate-300"
                        >{isTournamentMode ? modes.tournament.label : modes.standard.label}</span
                    >
                </div>

                <!-- Subtle Pattern Overlay -->
                <div
                    class="absolute inset-0 opacity-10 pointer-events-none bg-[url('/images/pattern.svg')] bg-repeat"
                ></div>
            </div>

            <!-- Card 2: Lesson (Image Background) -->
            <div
                class="relative rounded-[2rem] overflow-hidden group min-h-[350px] sm:min-h-[450px] lg:min-h-auto"
            >
                <img
                    src="/images/images/lesson-card.webp"
                    alt="Lesson"
                    onload={() => lessonImgLoaded = true}
                    class="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 {lessonImgLoaded ? 'opacity-100' : 'opacity-0'}"
                />
                <div
                    class="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"
                ></div>

                <div
                    class="absolute inset-0 flex items-center justify-center p-6"
                >
                    <a
                        href="/booking"
                        class="bg-gradient-to-r from-white/40 to-white/5 backdrop-blur-md rounded-full px-6 py-3.5 sm:px-8 sm:py-4 flex items-center gap-2 transition-all cursor-pointer hover:bg-white/20 hover:scale-102 group/btn"
                    >
                        <span class="text-white font-semibold text-base sm:text-lg"
                            >{languageState.current === "ID" ? "Kelas Privat & Grup" : "Private & Group Lessons"}</span
                        >
                        <i class="ph-duotone ph-arrow-right text-white text-base"></i>
                    </a>
                </div>
            </div>

            <!-- Card 3: Trainers (Light Gray) -->
            <div
                class="bg-slate-100 rounded-[2rem] min-h-[420px] sm:min-h-[480px] lg:min-h-auto p-6 sm:p-8 flex flex-col justify-between"
            >
                <div>
                    <h3 class="mb-4 text-slate-900 leading-tight">
                        <span
                            class="text-4xl sm:text-5xl lg:text-6xl font-bold"
                            >100+</span
                        > <br />
                        <span class="text-2xl sm:text-3xl font-semibold"
                            >{languageState.current === "ID" ? "Pelatih Profesional" : "Professional Coaches"}</span
                        >
                    </h3>
                    <p class="text-slate-500 leading-relaxed text-sm sm:text-base mb-6">
                        {languageState.current === "ID" 
                            ? "Tim pelatih bersertifikat yang siap membantu meningkatkan kemampuan Anda dari teknik dasar hingga persiapan kompetisi." 
                            : "Certified coach team ready to help improve your skills from basic techniques to competition preparation."}
                    </p>
                </div>

                <div class="space-y-4">
                    <!-- Stat Bar Item 1 -->
                    <div>
                        <div class="flex justify-between mb-1.5 text-xs font-semibold">
                            <span class="text-slate-800"
                                >{languageState.current === "ID" ? "Pemula" : "Beginners"}</span
                            >
                            <span class="text-slate-500"
                                >55%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                            <div
                                class="bg-[#2B95FF] h-2 rounded-full"
                                style="width: 55%"
                            ></div>
                        </div>
                    </div>

                    <!-- Stat Bar Item 2 -->
                    <div>
                        <div class="flex justify-between mb-1.5 text-xs font-semibold">
                            <span class="text-slate-800"
                                >{languageState.current === "ID" ? "Menengah" : "Intermediate"}</span
                            >
                            <span class="text-slate-500"
                                >40%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                            <div
                                class="bg-[#2B95FF] h-2 rounded-full"
                                style="width: 40%"
                            ></div>
                        </div>
                    </div>

                    <!-- Stat Bar Item 3 -->
                    <div>
                        <div class="flex justify-between mb-1.5 text-xs font-semibold">
                            <span class="text-slate-800"
                                >{languageState.current === "ID" ? "Lanjutan" : "Advanced"}</span
                            >
                            <span class="text-slate-500"
                                >35%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-2">
                            <div
                                class="bg-[#2B95FF] h-2 rounded-full"
                                style="width: 35%"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 3: Stats -->
        <div class="mt-8 sm:mt-12" bind:this={statsSection}>
            <h4
                class="text-xs text-center font-bold text-slate-400 mb-8 uppercase tracking-widest"
            >
                {languageState.current === "ID" ? "Beberapa capaian yang kami banggakan" : "Milestones We Are Proud Of"}
            </h4>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                {#each stats as stat, i}
                    <div class="text-center">
                        <div
                            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mb-2 text-slate-900 tabular-nums tracking-tight"
                        >
                            {Math.floor($statsValues[i]).toLocaleString(
                                "id-ID",
                            )}{stat.suffix}
                        </div>
                        <div
                            class="text-slate-500 text-xs sm:text-sm md:text-base leading-tight font-light"
                        >
                            {languageState.current === "ID" ? stat.label : stat.labelEN}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

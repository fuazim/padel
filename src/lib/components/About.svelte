<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    let isTournamentMode = false;

    // Content for switcher
    const modes = {
        standard: {
            label: "Casual Mode",
            desc: "Lapangan padel berstandar profesional dengan sistem pencahayaan turnamen memastikan kualitas permainan tetap optimal kapan pun Anda bermain.",
        },
        tournament: {
            label: "Tournament Mode",
            desc: "Pencahayaan intensitas tinggi dan setup lapangan resmi standar World Padel Tour untuk pengalaman kompetisi sesungguhnya.",
        },
    };

    // Stats Interaction
    let statsSection: HTMLElement;
    const stats = [
        { value: 12000, label: "Jam bermain <br/> setiap tahun", suffix: "+" },
        { value: 89, label: "Tingkat retensi <br/> member", suffix: "%" },
        { value: 1200, label: "Member <br/> aktif", suffix: "+" },
        {
            value: 125,
            label: "Turnamen & event <br/> setiap tahun",
            suffix: "+",
        },
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
            { threshold: 0.5 },
        );

        if (statsSection) observer.observe(statsSection);

        return () => observer.disconnect();
    });
</script>

<section
    id="about"
    class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
>
    <div class="flex flex-col gap-8 md:gap-12">
        <!-- Row 1: Header Badge & Description -->
        <div
            class="flex flex-col lg:flex-row justify-between items-start gap-8"
        >
            <div
                class="px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide flex-shrink-0"
            >
                Tentang Padel
            </div>

            <h2
                class="text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-black max-w-4xl lg:text-right"
            >
                Sejak 202 Padel hadir sebagai tempat berlatih dan berkembang
                bagi para pemain pemula hingga atlet berpengalaman.
            </h2>
        </div>

        <!-- Row 2: Cards Grid -->
        <div
            class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-[400px] md:min-h-[500px]"
        >
            <!-- Card 1: Features (Black) -->
            <div
                class="bg-black text-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group"
            >
                <div class="z-10">
                    <div class="w-16 h-16 mb-6 text-white">
                        <img
                            src="/images/icons/padel-court.svg"
                            alt="Padel Court"
                            class="w-full h-full invert brightness-0 filter"
                        />
                    </div>

                    <div class="min-h-[120px]">
                        {#key isTournamentMode}
                            <p
                                class="text-3xl font-normal leading-tight text-white"
                                in:fade={{ duration: 200 }}
                            >
                                {isTournamentMode
                                    ? modes.tournament.desc
                                    : modes.standard.desc}
                            </p>
                        {/key}
                    </div>
                </div>

                <div class="z-10 mt-6 flex items-center gap-4">
                    <!-- Toggle Switch -->
                    <button
                        class="w-16 h-8 rounded-full bg-[#0099FF] p-1 flex items-center transition-colors duration-300 relative focus:outline-none"
                        onclick={() => (isTournamentMode = !isTournamentMode)}
                        aria-label="Toggle game mode"
                    >
                        <div
                            class="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
                            style="transform: translateX({isTournamentMode
                                ? '32px'
                                : '0px'})"
                        ></div>
                    </button>
                    <!-- Label next to toggle -->
                    <span class="text-base font-light text-gray-300"
                        >{isTournamentMode
                            ? modes.tournament.label
                            : modes.standard.label}</span
                    >
                </div>

                <!-- Subtle Pattern Overlay -->
                <div
                    class="absolute inset-0 opacity-10 pointer-events-none bg-[url('/images/pattern.png')] bg-repeat"
                ></div>
            </div>

            <!-- Card 2: Lesson (Image Background) -->
            <div
                class="relative rounded-2xl md:rounded-[2rem] overflow-hidden group min-h-[350px] md:min-h-[500px] lg:min-h-auto"
            >
                <img
                    src="/images/images/lesson-card.png"
                    alt="Lesson"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                    class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"
                ></div>

                <div
                    class="absolute inset-0 flex items-center justify-center p-6"
                >
                    <!-- Button similar to Hero Trainer Card -->
                    <button
                        class="bg-gradient-to-r from-white/40 to-white/5 backdrop-blur-md rounded-full px-8 py-4 flex items-center gap-3 transition-all cursor-pointer hover:bg-white/20 hover:scale-105 group/btn"
                    >
                        <span class="text-white font-medium text-lg"
                            >Kelas Privat & Grup</span
                        >
                    </button>
                </div>
            </div>

            <!-- Card 3: Trainers (Light Gray) -->
            <div
                class="bg-gray-100 rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-between"
            >
                <div>
                    <h3 class="mb-4 text-black leading-tight">
                        <span
                            class="text-4xl md:text-5xl lg:text-6xl font-semibold"
                            >100+</span
                        > <br />
                        <span class="text-3xl font-medium"
                            >Pelatih Profesional</span
                        >
                    </h3>
                    <p class="text-gray-600 leading-relaxed text-base mb-8">
                        Tim pelatih bersertifikat yang siap membantu
                        meningkatkan kemampuan Anda dari teknik dasar hingga
                        persiapan kompetisi.
                    </p>
                </div>

                <div class="space-y-6">
                    <!-- Stat Bar Item 1 -->
                    <div>
                        <div class="flex justify-between mb-2">
                            <span class="text-sm font-medium text-gray-900"
                                >Pemula</span
                            >
                            <span class="text-sm font-medium text-gray-500"
                                >55</span
                            >
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div
                                class="bg-[#0099FF] h-2 rounded-full"
                                style="width: 55%"
                            ></div>
                        </div>
                    </div>

                    <!-- Stat Bar Item 2 -->
                    <div>
                        <div class="flex justify-between mb-2">
                            <span class="text-sm font-medium text-gray-900"
                                >Menengah</span
                            >
                            <span class="text-sm font-medium text-gray-500"
                                >40</span
                            >
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div
                                class="bg-[#0099FF] h-2 rounded-full"
                                style="width: 40%"
                            ></div>
                        </div>
                    </div>

                    <!-- Stat Bar Item 3 -->
                    <div>
                        <div class="flex justify-between mb-2">
                            <span class="text-sm font-medium text-gray-900"
                                >Lanjutan</span
                            >
                            <span class="text-sm font-medium text-gray-500"
                                >35</span
                            >
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div
                                class="bg-[#0099FF] h-2 rounded-full"
                                style="width: 35%"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 3: Stats -->
        <div class="" bind:this={statsSection}>
            <h4
                class="text-sm text-center font-medium text-gray-500 mb-8 uppercase tracking-wider"
            >
                Beberapa capaian yang kami banggakan
            </h4>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                {#each stats as stat, i}
                    <div class="text-center">
                        <div
                            class="text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 text-black tabular-nums"
                        >
                            {Math.floor($statsValues[i]).toLocaleString(
                                "id-ID",
                            )}{stat.suffix}
                        </div>
                        <div
                            class="text-gray-600 text-sm md:text-base leading-tight"
                        >
                            {@html stat.label}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

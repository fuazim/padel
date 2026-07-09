<script lang="ts">
    import { languageState } from "$lib/state.svelte";
    import { fade } from "svelte/transition";
    
    // Carousel state
    let startIndex = $state(0);

    const services = $derived([
        {
            id: 1,
            tag: languageState.current === "ID" ? "Program Pelatihan" : "Training Program",
            title: languageState.current === "ID" ? "Program Kelas Pelatihan" : "Class Training Program",
            desc: languageState.current === "ID" ? "Program dirancang untuk semua usia dan tingkat kemampuan." : "Programs designed for all ages and skill levels.",
            img: "/images/images/practice-card.webp",
            link: "/booking?coach=true"
        },
        {
            id: 2,
            tag: languageState.current === "ID" ? "Akses Lapangan" : "Court Access",
            title: languageState.current === "ID" ? "Sewa Lapangan per Jam" : "Hourly Court Rental",
            desc: languageState.current === "ID" ? "Nikmati fasilitas lapangan indoor & outdoor yang dirancang untuk mendukung permainan terbaik." : "Enjoy indoor & outdoor court facilities designed to support the best play.",
            img: "/images/images/lesson-card.webp",
            link: "/booking"
        },
        {
            id: 3,
            tag: languageState.current === "ID" ? "Komunitas & Event" : "Community & Events",
            title: languageState.current === "ID" ? "Turnamen & Matchplay" : "Tournaments & Matchplay",
            desc: languageState.current === "ID" ? "Ikuti liga internal reguler, temukan lawan seimbang, dan bergabunglah bersama komunitas Padel." : "Join regular internal leagues, find balanced opponents, and join the Padel community.",
            img: "/images/images/hero-image.webp",
            link: "/#membership"
        }
    ]);

    // Active cards to display in slot 1 (Column 2) and slot 2 (Column 3)
    const card1 = $derived(services[startIndex]);
    const card2 = $derived(services[(startIndex + 1) % services.length]);

    function handleNext() {
        startIndex = (startIndex + 1) % services.length;
    }

    function handlePrev() {
        startIndex = (startIndex - 1 + services.length) % services.length;
    }
</script>

<section
    id="services"
    class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-20"
>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Column 1: Text Content -->
        <div
            class="flex flex-col justify-between items-start lg:pr-8 min-h-[180px] md:min-h-[220px]"
        >
            <div>
                <div class="inline-block px-5 py-2 mb-4 sm:mb-6 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-500 tracking-wider">
                    {languageState.current === "ID" ? "Program & Layanan" : "Programs & Services"}
                </div>
                <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.1] font-normal text-slate-900 tracking-tight">
                    {languageState.current === "ID" ? "Program Kelas & Sewa Lapangan" : "Class Programs & Court Rentals"}
                </h2>
            </div>
            
            <a 
                href="/booking"
                class="self-start bg-slate-900 text-white hover:bg-black transition-all font-semibold px-8 py-3.5 rounded-full text-sm cursor-pointer flex items-center gap-2 mt-4 sm:mt-6"
            >
                <span>{languageState.current === "ID" ? "Mulai Sewa Lapangan" : "Start Court Booking"}</span>
                <i class="ph-duotone ph-calendar text-base text-[#2B95FF]"></i>
            </a>
        </div>

        <!-- Column 2: Card 1 (Dynamic from Carousel) -->
        {#key card1.id}
            <a
                href={card1.link}
                class="relative rounded-[2rem] overflow-hidden group min-h-[320px] sm:min-h-[420px] flex flex-col justify-between block cursor-pointer transition-all hover:ring-2 hover:ring-[#2B95FF]/20"
                in:fade={{ duration: 300 }}
            >
                <img
                    src={card1.img}
                    alt={card1.title}
                    class="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                ></div>

                <div class="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full w-full">
                    <div class="self-start">
                        <span
                            class="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-white"
                        >
                            {card1.tag}
                        </span>
                    </div>

                    <div class="flex items-end justify-between gap-4 mt-auto">
                        <div class="flex flex-col gap-1.5 max-w-[75%]">
                            <h3 class="text-white text-lg sm:text-xl font-bold tracking-tight">{card1.title}</h3>
                            <p class="text-white/80 text-xs sm:text-sm leading-relaxed font-light">
                                {card1.desc}
                            </p>
                        </div>
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 flex items-center justify-center text-white flex-shrink-0 transition-transform duration-300 group-hover:bg-[#2B95FF]"
                        >
                            <i class="ph-duotone ph-arrow-up-right text-base sm:text-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
                        </div>
                    </div>
                </div>
            </a>
        {/key}

        <!-- Column 3: Card 2 & Info & Navigation -->
        <div class="flex flex-col gap-6 sm:gap-8 justify-between">
            <!-- Card 2 (Dynamic from Carousel) -->
            {#key card2.id}
                <a
                    href={card2.link}
                    class="relative rounded-[2rem] overflow-hidden group min-h-[180px] sm:min-h-[200px] flex flex-col justify-between block cursor-pointer transition-all hover:ring-2 hover:ring-[#2B95FF]/20 animate-fade"
                    in:fade={{ duration: 300 }}
                >
                    <img
                        src={card2.img}
                        alt={card2.title}
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                    ></div>

                    <div class="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full w-full">
                        <div class="self-start">
                            <span
                                class="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-white"
                            >
                                {card2.tag}
                            </span>
                        </div>

                        <div class="mt-auto">
                            <h3 class="text-white text-base sm:text-lg font-bold tracking-tight">
                                {card2.title}
                            </h3>
                        </div>
                    </div>
                </a>
            {/key}

            <!-- Description and Navigation Controls -->
            <div class="flex flex-col justify-between gap-4">
                <p class="text-slate-500 leading-relaxed text-sm sm:text-base font-light min-h-[50px]">
                    {card2.desc}
                </p>

                <div class="flex gap-3 mt-2">
                    <button
                        onclick={handlePrev}
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group cursor-pointer"
                        aria-label="Previous slide"
                    >
                        <i class="ph-duotone ph-arrow-left text-base sm:text-lg"></i>
                    </button>
                    <button
                        onclick={handleNext}
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group cursor-pointer"
                        aria-label="Next slide"
                    >
                        <i class="ph-duotone ph-arrow-right text-base sm:text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

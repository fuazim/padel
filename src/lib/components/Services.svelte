<script lang="ts">
    import { currentLanguage } from "$lib/stores/language";

    const texts = {
        id: {
            badge: "Layanan",
            heading:
                "Temukan berbagai program latihan dan coaching padel mulai dari dasar hingga persiapan turnamen. Kami siap mendukung pemain di setiap level.",
            seeMore: "Lihat Lebih Banyak",
            trainingProgram: "Program Pelatihan",
            trainingDesc:
                "Program dirancang untuk semua usia dan tingkat kemampuan.",
            courtAccess: "Akses Lapangan",
            courtRental: "Sewa Lapangan per Jam",
            facilitiesDesc:
                "Nikmati fasilitas yang dirancang untuk mendukung perkembangan, kompetisi, dan pengalaman bermain terbaik.",
        },
        en: {
            badge: "Services",
            heading:
                "Discover various padel training and coaching programs from basics to tournament preparation. We're ready to support players at every level.",
            seeMore: "See More",
            trainingProgram: "Training Program",
            trainingDesc: "Programs designed for all ages and skill levels.",
            courtAccess: "Court Access",
            courtRental: "Hourly Court Rental",
            facilitiesDesc:
                "Enjoy facilities designed to support your development, competition, and the best playing experience.",
        },
    };

    $: t = texts[$currentLanguage];
</script>

<section
    id="services"
    class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-20"
>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 h-full">
        <!-- Column 1: Text Content -->
        <div
            class="flex flex-col justify-between items-start lg:pr-8 h-full min-h-[200px] md:min-h-[250px]"
        >
            <div>
                <div
                    class="inline-block px-5 py-2 mb-8 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide"
                >
                    {t.badge}
                </div>

                <h2
                    class="text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-black mb-12"
                >
                    {t.heading}
                </h2>
            </div>

            <button
                class="bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-gray-900 transition-colors inline-flex items-center gap-2 group"
            >
                {t.seeMore}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                </svg>
            </button>
        </div>

        <!-- Column 2: Card 1 (Training Program) -->
        <div
            class="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden group min-h-[350px] md:min-h-[500px]"
        >
            <!-- Dummy Image -->
            <img
                src="/images/images/practice-card.png"
                alt="Training Program"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            ></div>

            <div class="absolute inset-0 p-6 flex flex-col justify-between">
                <div class="self-start">
                    <span
                        class="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium text-white"
                    >
                        {t.trainingProgram}
                    </span>
                </div>

                <div class="flex items-end justify-between gap-4">
                    <p class="text-white text-base leading-relaxed max-w-[80%]">
                        {t.trainingDesc}
                    </p>
                    <div
                        class="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white flex-shrink-0 transition-transform duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Column 3: Card 2 (Court Access) & Navigation -->
        <div class="flex flex-col h-full gap-6 md:gap-8">
            <!-- Card 2 -->
            <div
                class="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden group flex-grow min-h-[180px]"
            >
                <!-- Dummy Image -->
                <img
                    src="/images/icons/tennis-ball.jpg"
                    alt="Court Access"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                ></div>

                <div class="absolute inset-0 p-6 flex flex-col justify-between">
                    <div class="self-start">
                        <span
                            class="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium text-white"
                        >
                            {t.courtAccess}
                        </span>
                    </div>

                    <div>
                        <h3 class="text-white text-base leading-relaxed">
                            {t.courtRental}
                        </h3>
                    </div>
                </div>
            </div>

            <div class="flex flex-col justify-between gap-6">
                <p class="text-gray-600 leading-relaxed">
                    {t.facilitiesDesc}
                </p>

                <div class="flex gap-4">
                    <button
                        class="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all group"
                        aria-label="Previous slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                    </button>
                    <button
                        class="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all group"
                        aria-label="Next slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

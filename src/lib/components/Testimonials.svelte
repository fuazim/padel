<script lang="ts">
    import { fade, fly } from "svelte/transition";

    const testimonials = [
        {
            id: 1,
            name: "Nadia Putri",
            role: "Recreational Player",
            rating: 4.9,
            quote: "Sudah lama mau coba padel tapi bingung mulai dari mana. Di Padel, semuanya terasa natural — pelatihnya sabar, fasilitasnya nyaman, dan progress saya benar-benar kelihatan.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Nadia+Putri",
        },
        {
            id: 2,
            name: "Andreas Santoso",
            role: "Beginner Member",
            rating: 5.0,
            quote: "Saya awalnya cuma ikut teman. Sekarang malah jadi rutin latihan tiap minggu. Sistem membership-nya fleksibel dan kelasnya selalu fun namun tetap teknis.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Andreas+Santoso",
        },
        {
            id: 3,
            name: "Maya Rahman",
            role: "Intermediate Player",
            rating: 4.8,
            quote: "Pelatih di sini benar-benar paham perkembangan pemain. Teknik saya dibenahi pelan-pelan, tapi hasilnya terasa signifikan.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Maya+Rahman",
        },
        {
            id: 4,
            name: "Rico Halim",
            role: "Club Tournament Participant",
            rating: 4.7,
            quote: "Turnamen internalnya seru banget. Komunitasnya suportif, bukan yang bikin terintimidasi. Cocok untuk yang suka belajar sambil santai.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Rico+Halim",
        },
        {
            id: 5,
            name: "Laras Widodo",
            role: "Parent of Junior Player",
            rating: 4.9,
            quote: "Anak saya ikut junior program di sini. Pelatih-pelatihnya ramah dan profesional. Dia jadi lebih percaya diri — bukan cuma di lapangan, tapi juga di sekolah.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Laras+Widodo",
        },
        {
            id: 6,
            name: "Kevin Wijaya",
            role: "Active Member",
            rating: 4.6,
            quote: "Saya sudah pernah coba beberapa klub olahraga. Padel terasa beda: fasilitasnya rapi, jam latihan jelas, dan stafnya helpful.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Kevin+Wijaya",
        },
        {
            id: 7,
            name: "Ayu Rahma",
            role: "Private Coaching Student",
            rating: 5.0,
            quote: "Private lesson-nya sangat efektif. Pelatihnya detail tapi tetap santai. Dalam beberapa minggu saja teknik saya banyak berkembang.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Ayu+Rahma",
        },
        {
            id: 8,
            name: "Daniel Surya",
            role: "Weekend Player",
            rating: 4.8,
            quote: "Kalau mau olahraga tapi tetap fun, padel jawabannya. Di Padel, suasananya ramah dan profesional — bikin betah datang lagi.",
            image: "https://placehold.co/600x500/e2e8f0/1e293b?text=Daniel+Surya",
        },
    ];

    let currentIndex = 0;

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
    }

    function prevTestimonial() {
        currentIndex =
            (currentIndex - 1 + testimonials.length) % testimonials.length;
    }

    // Generate stars for rating
    function getStars(rating: number) {
        return Array(5)
            .fill(0)
            .map((_, i) => i < Math.floor(rating));
    }
</script>

<section
    id="testimonials"
    class="w-full bg-white pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden"
>
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center"
        >
            <!-- Left Content -->
            <div
                class="flex flex-col items-start relative z-10 h-full justify-center"
            >
                <!-- Badge -->
                <div
                    class="inline-block px-5 py-2 mb-8 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide"
                >
                    Cerita dari Member Kami
                </div>

                <!-- Quote (Dynamic) -->
                <div
                    class="grid grid-cols-1 grid-rows-1 mb-6 md:mb-8 min-h-[120px] md:min-h-[180px]"
                >
                    {#key currentIndex}
                        <blockquote
                            class="col-start-1 row-start-1 text-xl md:text-2xl lg:text-3xl font-normal text-black leading-snug"
                            in:fade={{ duration: 500 }}
                            out:fade={{ duration: 500 }}
                        >
                            "{testimonials[currentIndex].quote}"
                        </blockquote>
                    {/key}
                </div>

                <!-- Info & Nav Wrapper -->
                <div class="w-full flex justify-between items-end mt-4">
                    <!-- User Info & Rating (Dynamic) -->
                    <div class="grid grid-cols-1 grid-rows-1">
                        {#key currentIndex}
                            <div
                                class="col-start-1 row-start-1"
                                in:fade={{ duration: 500 }}
                                out:fade={{ duration: 500 }}
                            >
                                <!-- Rating -->
                                <div class="flex items-center gap-4 mb-2">
                                    <div class="flex gap-1">
                                        {#each getStars(testimonials[currentIndex].rating) as isFilled, i}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                class="w-5 h-5 {isFilled
                                                    ? 'text-[#FFA800]'
                                                    : 'text-gray-300'}"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        {/each}
                                    </div>
                                    <span
                                        class="text-lg font-medium text-gray-900"
                                        >{testimonials[currentIndex]
                                            .rating}</span
                                    >
                                </div>

                                <!-- Name & Role -->
                                <div>
                                    <h4
                                        class="text-xl font-semibold text-black"
                                    >
                                        {testimonials[currentIndex].name}
                                    </h4>
                                    <p class="text-gray-500 text-base">
                                        {testimonials[currentIndex].role}
                                    </p>
                                </div>
                            </div>
                        {/key}
                    </div>

                    <!-- Navigation Buttons (Static) -->
                    <div class="flex gap-4">
                        <button
                            type="button"
                            onclick={prevTestimonial}
                            class="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors group"
                            aria-label="Previous testimonial"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="w-5 h-5 text-gray-700 transition-transform group-hover:-translate-x-1"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onclick={nextTestimonial}
                            class="w-14 h-14 rounded-full bg-[#0099FF] flex items-center justify-center hover:bg-[#0088E0] transition-colors group shadow-lg shadow-blue-200"
                            aria-label="Next testimonial"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="w-5 h-5 text-white transition-transform group-hover:translate-x-1"
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

            <!-- Right Content: Image & Index -->
            <div
                class="relative flex flex-col items-center lg:items-end justify-center lg:pl-12 pt-12 md:pt-16"
            >
                <!-- Index Number (Dynamic) -->
                {#key currentIndex}
                    <div
                        class="absolute -top-10 md:-top-16 lg:-top-24 right-0 flex items-end z-20"
                        in:fly={{ y: -20, duration: 600, delay: 200 }}
                        out:fade={{ duration: 200 }}
                    >
                        <span
                            class="text-5xl md:text-6xl lg:text-7xl font-light text-black tracking-tighter"
                        >
                            {String(currentIndex + 1).padStart(2, "0")}
                        </span>
                        <span class="text-xl text-gray-400 mb-2 ml-2"
                            >/ {testimonials.length}</span
                        >
                    </div>
                {/key}

                <!-- Image Card (Dynamic) -->
                <div
                    class="w-full max-w-[560px] aspect-[4/3] rounded-2xl md:rounded-[2.5rem] overflow-hidden relative grid grid-cols-1 grid-rows-1 bg-gray-100"
                >
                    {#key currentIndex}
                        <img
                            src={testimonials[currentIndex].image}
                            alt={testimonials[currentIndex].name}
                            class="col-start-1 row-start-1 w-full h-full object-cover"
                            in:fade={{ duration: 600 }}
                            out:fade={{ duration: 600 }}
                        />
                    {/key}
                </div>
            </div>
        </div>
    </div>
</section>

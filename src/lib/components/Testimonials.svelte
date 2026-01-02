<script lang="ts">
    import { fade, fly } from "svelte/transition";

    const testimonials = [
        {
            id: 1,
            name: "Nadia Putri",
            role: "Recreational Player",
            rating: 4.9,
            quote: "Sudah lama mau coba padel tapi bingung mulai dari mana. Di Padel, semuanya terasa natural — pelatihnya sabar, fasilitasnya nyaman, dan progress saya benar-benar kelihatan.",
            image: "/images/testimonials/nadia-putri.jpg",
        },
        {
            id: 2,
            name: "Andreas Santoso",
            role: "Beginner Member",
            rating: 5.0,
            quote: "Saya awalnya cuma ikut teman. Sekarang malah jadi rutin latihan tiap minggu. Sistem membership-nya fleksibel dan kelasnya selalu fun namun tetap teknis.",
            image: "/images/testimonials/andreas-santoso.jpg",
        },
        {
            id: 3,
            name: "Maya Rahman",
            role: "Intermediate Player",
            rating: 4.8,
            quote: "Pelatih di sini benar-benar paham perkembangan pemain. Teknik saya dibenahi pelan-pelan, tapi hasilnya terasa signifikan.",
            image: "/images/testimonials/maya-rahman.jpg",
        },
        {
            id: 4,
            name: "Rico Halim",
            role: "Club Tournament Participant",
            rating: 4.7,
            quote: "Turnamen internalnya seru banget. Komunitasnya suportif, bukan yang bikin terintimidasi. Cocok untuk yang suka belajar sambil santai.",
            image: "/images/testimonials/rico-halim.jpg",
        },
        {
            id: 5,
            name: "Laras Widodo",
            role: "Parent of Junior Player",
            rating: 4.9,
            quote: "Anak saya ikut junior program di sini. Pelatih-pelatihnya ramah dan profesional. Dia jadi lebih percaya diri — bukan cuma di lapangan, tapi juga di sekolah.",
            image: "/images/testimonials/laras-widodo.jpg",
        },
        {
            id: 6,
            name: "Kevin Wijaya",
            role: "Active Member",
            rating: 4.6,
            quote: "Saya sudah pernah coba beberapa klub olahraga. Padel terasa beda: fasilitasnya rapi, jam latihan jelas, dan stafnya helpful.",
            image: "/images/testimonials/kevin-wijaya.jpg",
        },
        {
            id: 7,
            name: "Ayu Rahma",
            role: "Private Coaching Student",
            rating: 5.0,
            quote: "Private lesson-nya sangat efektif. Pelatihnya detail tapi tetap santai. Dalam beberapa minggu saja teknik saya banyak berkembang.",
            image: "/images/testimonials/ayu-rahma.jpg",
        },
        {
            id: 8,
            name: "Daniel Surya",
            role: "Weekend Player",
            rating: 4.8,
            quote: "Kalau mau olahraga tapi tetap fun, padel jawabannya. Di Padel, suasananya ramah dan profesional — bikin betah datang lagi.",
            image: "/images/testimonials/daniel-surya.jpg",
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
    class="w-full bg-white py-12 md:py-20 overflow-hidden"
>
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 lg:gap-24 items-center"
        >
            <!-- Left Content Wrapper -->
            <!-- Mobile: contents (children grid items). Desktop: Flex Column. -->
            <div
                class="contents lg:flex lg:flex-col lg:items-start lg:justify-center lg:relative lg:z-10 lg:h-full"
            >
                <!-- Badge -->
                <div
                    class="order-1 lg:order-none inline-block px-5 py-2 mb-0 lg:mb-8 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide justify-self-start"
                >
                    Cerita dari Member Kami
                </div>

                <!-- Quote (Dynamic) -->
                <div
                    class="order-5 lg:order-none grid grid-cols-1 grid-rows-1 mb-6 md:mb-8 min-h-[240px] md:min-h-[320px]"
                >
                    {#key currentIndex}
                        <div
                            class="col-start-1 row-start-1 flex flex-col items-start gap-6"
                            in:fade={{ duration: 500 }}
                            out:fade={{ duration: 500 }}
                        >
                            <blockquote
                                class="text-xl md:text-2xl lg:text-3xl font-normal text-black leading-snug"
                            >
                                "{testimonials[currentIndex].quote}"
                            </blockquote>

                            <!-- Rating -->
                            <div class="flex items-center gap-4">
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
                                <span class="text-lg font-medium text-gray-900"
                                    >{testimonials[currentIndex].rating}</span
                                >
                            </div>
                        </div>
                    {/key}
                </div>

                <!-- Info & Nav Wrapper -->
                <div
                    class="order-3 lg:order-none w-full flex justify-between items-end mb-2 lg:mb-0 lg:mt-4"
                >
                    <!-- User Info (Dynamic) -->
                    <div class="grid grid-cols-1 grid-rows-1 min-h-[60px]">
                        {#key currentIndex}
                            <div
                                class="col-start-1 row-start-1"
                                in:fade={{ duration: 500 }}
                                out:fade={{ duration: 500 }}
                            >
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
                            class="w-14 h-14 rounded-full bg-[#0099FF] flex items-center justify-center hover:bg-[#0088E0] transition-colors group"
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

            <!-- Right Content Wrapper -->
            <!-- Mobile: contents. Desktop: Flex Column/Relative. -->
            <div
                class="contents lg:flex lg:flex-col lg:items-end lg:justify-center lg:pl-12 lg:pt-10 lg:relative"
            >
                <!-- Index Number (Dynamic) -->
                <!-- Mobile: Order 2. Static/Relative. -->
                <!-- Desktop: Absolute top. -->
                <div
                    class="order-2 lg:order-none w-full grid grid-cols-1 grid-rows-1 mb-0 lg:mb-0 lg:absolute lg:-top-10 lg:right-0 z-20 min-h-[60px] md:min-h-[80px]"
                >
                    {#key currentIndex}
                        <div
                            class="col-start-1 row-start-1 flex justify-between lg:justify-end"
                            in:fade={{ duration: 300 }}
                            out:fade={{ duration: 150 }}
                        >
                            <div class="flex items-end">
                                <span
                                    class="text-5xl md:text-6xl lg:text-7xl font-light text-black tracking-tighter"
                                >
                                    {String(currentIndex + 1).padStart(2, "0")}
                                </span>
                                <span class="text-xl text-gray-400 mb-2 ml-2"
                                    >/ {testimonials.length}</span
                                >
                            </div>
                        </div>
                    {/key}
                </div>

                <!-- Image Card (Dynamic) -->
                <!-- Mobile: Order 3. -->
                <div
                    class="order-4 lg:order-none w-full max-w-[560px] aspect-[4/3] rounded-2xl md:rounded-[2.5rem] overflow-hidden relative grid grid-cols-1 grid-rows-1 bg-gray-100 mb-4 lg:mb-0 mx-auto lg:mx-0"
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

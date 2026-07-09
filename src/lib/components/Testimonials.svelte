<script lang="ts">
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";

    const testimonials = [
        {
            id: 1,
            name: "Nadia Putri",
            role: "Pemain Rekreasi",
            roleEN: "Recreational Player",
            rating: 5,
            quote: "Sudah lama mau coba padel tapi bingung mulai dari mana. Di Padel, semuanya terasa natural — pelatihnya sabar, fasilitasnya nyaman, dan progress saya benar-benar kelihatan.",
            quoteEN: "I've wanted to try padel for a long time but didn't know where to start. Here, everything feels natural — patient coaches, comfortable facilities, and my progress is visible.",
            image: "/images/testimonials/nadia-putri.jpg",
        },
        {
            id: 2,
            name: "Andreas Santoso",
            role: "Member Pemula",
            roleEN: "Beginner Member",
            rating: 5,
            quote: "Saya awalnya cuma ikut teman. Sekarang malah jadi rutin latihan tiap minggu. Sistem membership-nya fleksibel dan kelasnya selalu fun namun tetap teknis.",
            quoteEN: "I originally just joined a friend. Now, I train weekly. The membership system is flexible and the classes are always fun yet technical.",
            image: "/images/testimonials/andreas-santoso.jpg",
        },
        {
            id: 3,
            name: "Maya Rahman",
            role: "Pemain Menengah",
            roleEN: "Intermediate Player",
            rating: 5,
            quote: "Pelatih di sini benar-benar paham perkembangan pemain. Teknik saya dibenahi pelan-pelan, tapi hasilnya terasa signifikan.",
            quoteEN: "Coaches here understand player development. My technique was corrected gradually, and the results feel significant.",
            image: "/images/testimonials/maya-rahman.jpg",
        },
        {
            id: 4,
            name: "Rico Halim",
            role: "Peserta Turnamen Klub",
            roleEN: "Club Tournament Participant",
            rating: 5,
            quote: "Turnamen internalnya seru banget. Komunitasnya suportif, bukan yang bikin terintimidasi. Cocok untuk yang suka belajar sambil santai.",
            quoteEN: "The internal tournaments are so much fun. The community is supportive, not intimidating. Perfect for those who like to learn at a relaxed pace.",
            image: "/images/testimonials/rico-halim.jpg",
        },
        {
            id: 5,
            name: "Laras Widodo",
            role: "Orang Tua Pemain Junior",
            roleEN: "Parent of Junior Player",
            rating: 5,
            quote: "Anak saya ikut junior program di sini. Pelatih-pelatihnya ramah dan profesional. Dia jadi lebih percaya diri — bukan cuma di lapangan, tapi juga di sekolah.",
            quoteEN: "My child joined the junior program. The coaches are friendly and professional. She has become more confident — both on court and at school.",
            image: "/images/testimonials/laras-widodo.jpg",
        },
        {
            id: 6,
            name: "Kevin Wijaya",
            role: "Member Aktif",
            roleEN: "Active Member",
            rating: 5,
            quote: "Saya sudah pernah coba beberapa klub olahraga. Padel terasa beda: fasilitasnya rapi, jam latihan jelas, dan stafnya helpful.",
            quoteEN: "I've tried several sports clubs. Padel feels different: neat facilities, clear practice hours, and helpful staff.",
            image: "/images/testimonials/kevin-wijaya.jpg",
        },
        {
            id: 7,
            name: "Ayu Rahma",
            role: "Murid Privat",
            roleEN: "Private Coaching Student",
            rating: 5,
            quote: "Private lesson-nya sangat efektif. Pelatihnya detail tapi tetap santai. Dalam beberapa minggu saja teknik saya banyak berkembang.",
            quoteEN: "Private lessons are highly effective. The coach is detail-oriented yet relaxed. In just a few weeks, my technique has improved a lot.",
            image: "/images/testimonials/ayu-rahma.jpg",
        },
        {
            id: 8,
            name: "Daniel Surya",
            role: "Pemain Akhir Pekan",
            roleEN: "Weekend Player",
            rating: 5,
            quote: "Kalau mau olahraga tapi tetap fun, padel jawabannya. Di Padel, suasananya ramah dan profesional — bikin betah datang lagi.",
            quoteEN: "If you want to exercise but keep it fun, padel is the answer. The atmosphere is friendly and professional — makes you want to come back.",
            image: "/images/testimonials/daniel-surya.jpg",
        },
    ];

    let currentIndex = $state(0);

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    }
</script>

<section
    id="testimonials"
    class="w-full bg-white py-12 md:py-20 overflow-hidden"
>
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
            <!-- Left Column: Badge, Quote, Rating, Navigation -->
            <div class="flex flex-col gap-6 sm:gap-8 justify-center min-h-[300px] sm:min-h-[380px]">
                <!-- Badge -->
                <div
                    class="inline-block px-5 py-2 rounded-full border border-slate-200 text-xs sm:text-sm font-semibold text-slate-500 tracking-wider w-fit"
                >
                    {languageState.current === "ID" ? "Cerita dari Member Kami" : "Testimonials"}
                </div>

                <!-- Quote Section -->
                <div class="grid grid-cols-1 grid-rows-1 flex-grow">
                    {#key currentIndex}
                        <div
                            class="col-start-1 row-start-1 flex flex-col items-start gap-4 sm:gap-6"
                            in:fade={{ duration: 300 }}
                        >
                            <blockquote
                                class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-slate-900 leading-snug"
                            >
                                "{languageState.current === "ID" ? testimonials[currentIndex].quote : testimonials[currentIndex].quoteEN}"
                            </blockquote>

                            <!-- Rating -->
                            <div class="flex items-center gap-3 mt-1">
                                <div class="flex gap-0.5">
                                    {#each Array(5) as _, i}
                                        <i class="ph-duotone ph-star text-base sm:text-lg {i < testimonials[currentIndex].rating ? 'text-[#FFA800]' : 'text-slate-200'}"></i>
                                    {/each}
                                </div>
                                <span class="text-sm font-bold text-slate-800">{testimonials[currentIndex].rating.toFixed(1)}</span>
                            </div>
                        </div>
                    {/key}
                </div>

                <!-- Author Info & Nav Buttons -->
                <div
                    class="w-full flex flex-row justify-between items-end border-t border-slate-100 pt-6 mt-2"
                >
                    <!-- User Info -->
                    <div class="grid grid-cols-1 grid-rows-1 min-h-[50px] shrink-0">
                        {#key currentIndex}
                            <div
                                class="col-start-1 row-start-1"
                                in:fade={{ duration: 300 }}
                            >
                                <h4
                                    class="text-base sm:text-lg font-bold text-slate-900"
                                >
                                    {testimonials[currentIndex].name}
                                </h4>
                                <p class="text-slate-400 text-xs sm:text-sm font-light mt-0.5">
                                    {languageState.current === "ID" ? testimonials[currentIndex].role : testimonials[currentIndex].roleEN}
                                </p>
                            </div>
                        {/key}
                    </div>

                    <!-- Navigation Buttons -->
                    <div class="flex gap-2">
                        <button
                            type="button"
                            onclick={prevTestimonial}
                            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors group cursor-pointer"
                            aria-label="Previous testimonial"
                        >
                            <i class="ph-duotone ph-arrow-left text-base text-slate-600 transition-transform group-hover:-translate-x-0.5"></i>
                        </button>
                        <button
                            type="button"
                            onclick={nextTestimonial}
                            class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2B95FF] hover:bg-[#1a85f0] flex items-center justify-center transition-colors group cursor-pointer"
                            aria-label="Next testimonial"
                        >
                            <i class="ph-duotone ph-arrow-right text-base text-white transition-transform group-hover:translate-x-0.5"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Column: Image & Counter -->
            <div class="flex flex-col gap-4">
                <!-- Image Wrapper -->
                <div
                    class="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative grid grid-cols-1 grid-rows-1 bg-slate-100"
                >
                    {#key currentIndex}
                        <img
                            src={testimonials[currentIndex].image}
                            alt={testimonials[currentIndex].name}
                            class="col-start-1 row-start-1 w-full h-full object-cover"
                            in:fade={{ duration: 400 }}
                        />
                    {/key}

                    <!-- Index Count overlay on image (looks extremely premium!) -->
                    <div class="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white tracking-widest flex items-center gap-1">
                        <span>{String(currentIndex + 1).padStart(2, "0")}</span>
                        <span class="opacity-40">/</span>
                        <span class="opacity-60">{String(testimonials.length).padStart(2, "0")}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

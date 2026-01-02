<script lang="ts">
</script>

<section id="hero" class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div
        class="relative w-full rounded-[3rem] overflow-hidden min-h-[750px] flex flex-col justify-center group bg-black"
    >
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
            <img
                src="/images/images/hero-image.png"
                alt="Padel Court Hero"
                class="w-full h-full object-cover transform transition-transform duration-[1s] ease-out group-hover:scale-105"
            />
            <!-- Refined Gradient Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"
            ></div>
        </div>

        <!-- Main Content -->
        <div
            class="relative z-10 w-full mt-24 md:mt-40 px-6 md:px-12 flex-grow flex flex-col justify-center items-center text-center pt-20 md:pt-32"
        >
            <div class="max-w-4xl mx-auto z-1">
                <h1
                    class="text-white text-5xl md:text-6xl lg:text-[4rem] font-normal leading-[1.05] mb-4 md:mb-8 tracking-tight"
                >
                    Upgrade Skill Padelmu
                    <span
                        class="block text-3xl md:text-4xl lg:text-[2rem] mt-2 font-light text-gray-200 tracking-normal"
                    >
                        Satu Ayunan Lebih Dekat Menuju Kemenangan
                    </span>
                </h1>

                <p
                    class="text-base md:text-lg text-gray-200 mb-6 md:mb-12 leading-relaxed font-light max-w-lg mx-auto tracking-wide"
                >
                    Rasakan serunya padel bersama pelatih berpengalaman,
                    fasilitas nyaman, dan komunitas yang suportif.
                </p>

                <button
                    class="bg-black text-white px-10 py-4 rounded-full text-base font-normal hover:bg-gray-900 transition-all hover:-translate-y-1 cursor-pointer items-center inline-flex"
                >
                    Mulai Perjalananmu
                </button>
            </div>
        </div>

        <!-- Bottom Section -->
        <div
            class="relative z-10 w-full px-6 md:px-8 pb-6 pt-12 md:pt-0 flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end gap-8 md:gap-8"
        >
            <!-- Bottom Left: Trainer Promo -->
            <div
                class="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-6"
            >
                <!-- Text must be readable on dark background, so keep it white/light -->
                <span
                    class="text-white text-sm font-light tracking-wide max-w-[200px] md:max-w-[150px] leading-tight opacity-90 text-center md:text-left"
                >
                    Mulai latihan bersama pelatih professional
                </span>

                <!-- Avatar Pill Card with Gradient from White (100%) to White (20%) -->
                <!-- Since the background is white on the left, we need to ensure the card border is subtle or removed if not needed. -->
                <!-- Avatar Pill Card with Gradient from White (40%) to White (5%) -->
                <div
                    class="bg-gradient-to-r from-white/40 to-white/5 backdrop-blur-md rounded-full p-1.5 flex items-center justify-center transition-colors cursor-default"
                >
                    <div class="flex -space-x-3">
                        <div
                            class="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-300"
                        >
                            <img
                                src="/images/images/trainer_1.jpg"
                                alt="Trainer 1"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div
                            class="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-400"
                        >
                            <img
                                src="/images/images/trainer_2.jpg"
                                alt="Trainer 2"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div
                            class="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-500"
                        >
                            <img
                                src="/images/images/trainer_3.jpg"
                                alt="Trainer 3"
                                class="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Right: Socials (Text Only) -->
            <div class="flex items-center gap-6">
                {#each ["Instagram", "Facebook", "TikTok"] as social}
                    <button
                        class="group flex items-center gap-2 text-white text-sm font-medium hover:text-gray-300 transition-colors duration-300"
                    >
                        {social}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                            />
                        </svg>
                    </button>
                {/each}
            </div>
        </div>
    </div>
</section>

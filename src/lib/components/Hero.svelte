<script lang="ts">
    import { languageState } from "$lib/state.svelte";
    let loaded = $state(false);
</script>

<section id="hero" class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div
        class="relative w-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden min-h-[550px] sm:min-h-[650px] lg:min-h-[750px] flex flex-col justify-center group bg-black"
    >
        <!-- Background Image -->
        <div class="absolute inset-0 z-0 bg-slate-950">
            <img
                src="/images/images/hero-image.webp"
                alt="Padel Court Hero"
                onload={() => loaded = true}
                class="w-full h-full object-cover transform transition-all duration-[1.2s] ease-out group-hover:scale-105 {loaded ? 'opacity-100' : 'opacity-0'}"
            />
            <!-- Refined Gradient Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
            ></div>
        </div>

        <!-- Main Content -->
        <div
            class="relative z-10 w-full mt-16 sm:mt-24 md:mt-40 px-4 sm:px-6 md:px-12 flex-grow flex flex-col justify-center items-center text-center pt-12 sm:pt-20 md:pt-32"
        >
            <div class="max-w-4xl mx-auto">
                <h1
                    class="text-white text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-normal leading-[1.1] mb-4 md:mb-8 tracking-tight"
                >
                    {languageState.current === "ID" ? "Upgrade Skill Padelmu" : "Upgrade Your Padel Skill"}
                    <span
                        class="block text-xl sm:text-2xl md:text-3xl lg:text-[2rem] mt-2 font-light text-gray-200 tracking-normal"
                    >
                        {languageState.current === "ID" ? "Satu Ayunan Lebih Dekat Menuju Kemenangan" : "One Swing Closer to Victory"}
                    </span>
                </h1>

                <p
                    class="text-sm sm:text-base md:text-lg text-gray-200 mb-6 md:mb-12 leading-relaxed font-light max-w-lg mx-auto tracking-wide"
                >
                    {languageState.current === "ID" 
                        ? "Rasakan serunya padel bersama pelatih berpengalaman, fasilitas nyaman, dan komunitas yang suportif." 
                        : "Experience the thrill of padel with experienced trainers, comfortable facilities, and a supportive community."}
                </p>

                <a
                    href="/booking"
                    class="bg-white text-slate-900 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-slate-100 transition-all hover:-translate-y-0.5 cursor-pointer items-center inline-flex gap-2"
                >
                    <i class="ph-duotone ph-calendar text-base text-[#2B95FF]"></i>
                    <span>{languageState.current === "ID" ? "Mulai Latihan" : "Start Training"}</span>
                </a>
            </div>
        </div>

        <!-- Bottom Section -->
        <div
            class="relative z-10 w-full px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-12 md:pt-0 flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end gap-6 md:gap-8"
        >
            <!-- Bottom Left: Trainer Promo -->
            <div
                class="flex flex-col-reverse md:flex-row items-center gap-3 md:gap-6"
            >
                <span
                    class="text-white text-xs sm:text-sm font-light tracking-wide max-w-[220px] md:max-w-[155px] leading-tight opacity-90 text-center md:text-left"
                >
                    {languageState.current === "ID" ? "Mulai latihan bersama pelatih professional" : "Start training with professional coaches"}
                </span>

                <!-- Avatar Pill Card -->
                <div
                    class="bg-gradient-to-r from-white/30 to-white/5 backdrop-blur-md rounded-full p-1.5 flex items-center justify-center transition-colors cursor-default"
                >
                    <div class="flex -space-x-3">
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-300"
                        >
                            <img
                                src="/images/images/trainer_1.jpg"
                                alt="Trainer 1"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-400"
                        >
                            <img
                                src="/images/images/trainer_2.jpg"
                                alt="Trainer 2"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-500"
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
            <div class="flex items-center gap-4 sm:gap-6">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                >
                    <span>Instagram</span>
                    <i class="ph-duotone ph-arrow-up-right text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                >
                    <span>Facebook</span>
                    <i class="ph-duotone ph-arrow-up-right text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
                </a>
                <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                >
                    <span>TikTok</span>
                    <i class="ph-duotone ph-arrow-up-right text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></i>
                </a>
            </div>
        </div>
    </div>
</section>

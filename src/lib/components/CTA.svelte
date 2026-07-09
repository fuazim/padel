<script lang="ts">
    import { currentLanguage } from "$lib/stores/language";

    let email = "";

    const texts = {
        id: {
            badge: "Gabung Sekarang",
            heading:
                "Dapatkan info terbaru, promo spesial, dan undangan event eksklusif langsung ke inbox kamu.",
            placeholder: "Masukkan alamat email...",
        },
        en: {
            badge: "Join Now",
            heading:
                "Get the latest updates, special promos, and exclusive event invitations directly to your inbox.",
            placeholder: "Enter your email address...",
        },
    };

    $: t = texts[$currentLanguage];

    function handleSubmit() {
        if (email) {
            // Handle email subscription
            console.log("Email submitted:", email);
            email = "";
        }
    }
</script>

<section
    id="cta"
    class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16"
>
    <div
        class="relative w-full rounded-3xl md:rounded-[3rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col justify-center"
    >
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
            <img
                src="/images/images/cta-background.png"
                alt="Padel Court"
                class="w-full h-full object-cover"
            />
            <!-- Dark Overlay for better text readability -->
            <div class="absolute inset-0 bg-black/30"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 px-6 md:px-12 lg:px-16 py-10 md:py-16">
            <!-- Badge -->
            <div
                class="inline-block px-5 py-2 mb-6 md:mb-8 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium text-white tracking-wide border border-white/20"
            >
                {t.badge}
            </div>

            <!-- Heading -->
            <h2
                class="text-2xl md:text-3xl lg:text-4xl font-normal text-white leading-snug max-w-2xl mb-8 md:mb-10"
            >
                {t.heading}
            </h2>

            <!-- Email Input -->
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                class="flex items-center max-w-md"
            >
                <div
                    class="flex items-center w-full bg-white/90 backdrop-blur-md rounded-full pl-5 pr-1.5 py-1.5 shadow-lg"
                >
                    <input
                        type="email"
                        bind:value={email}
                        placeholder={t.placeholder}
                        class="flex-grow bg-transparent text-gray-700 placeholder-gray-400 text-sm md:text-base py-2 border-none outline-none focus:ring-0 focus:border-none"
                        required
                    />
                    <button
                        type="submit"
                        class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2B95FF] flex items-center justify-center hover:bg-[#1a7fe6] transition-colors"
                        aria-label="Submit email"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-5 h-5 text-white"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
</section>

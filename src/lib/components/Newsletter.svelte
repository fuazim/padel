<script lang="ts">
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";

    let email = $state("");
    let submitted = $state(false);
    let errorMsg = $state("");
    let newsletterImgLoaded = $state(false);

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        errorMsg = "";

        if (!email) {
            errorMsg = languageState.current === "ID" ? "Email wajib diisi" : "Email is required";
            return;
        }

        if (!email.includes("@")) {
            errorMsg = languageState.current === "ID" ? "Format email salah" : "Invalid email format";
            return;
        }

        submitted = true;
        
        try {
            const list = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
            list.push({ email, date: new Date().toISOString().split("T")[0] });
            localStorage.setItem("newsletter_emails", JSON.stringify(list));
        } catch (_) {}
    }
</script>

<section class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <div
        class="relative w-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden min-h-[380px] md:min-h-[420px] flex flex-col justify-center bg-white border border-slate-200 group"
    >
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
            <img
                src="/images/images/newsletter-bg.webp"
                alt="Padel Racket and Balls on Court"
                onload={() => newsletterImgLoaded = true}
                class="w-full h-full object-cover object-center transform transition-all duration-[1.5s] ease-out group-hover:scale-105 {newsletterImgLoaded ? 'opacity-100' : 'opacity-0'}"
            />
            <!-- Light/Soft Gradient Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent max-md:bg-gradient-to-t max-md:from-white/95 max-md:via-white/85 max-md:to-white/50"
            ></div>
        </div>

        <!-- Content Area -->
        <div class="relative z-10 w-full px-5 sm:px-12 md:px-16 py-10 sm:py-12 flex flex-col justify-between items-start gap-6 sm:gap-8 max-w-[750px]">
            
            <!-- Badge (No Shadows) -->
            <div
                class="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-800 tracking-wider"
            >
                <span class="w-1.5 h-1.5 rounded-full bg-[#2B95FF] animate-pulse"></span>
                {languageState.current === "ID" ? "Gabung Sekarang" : "Join Now"}
            </div>

            <!-- Main Heading -->
            <h2
                class="text-slate-900 text-2xl sm:text-4xl md:text-5xl font-semibold leading-[1.2] sm:leading-[1.15] tracking-tight"
            >
                {#if languageState.current === "ID"}
                    Dapatkan Informasi Terbaru, Penawaran Khusus, dan Undangan Acara Eksklusif
                {:else}
                    Get the Latest Updates, Special Offers, and Exclusive Event Invitations
                {/if}
            </h2>

            <!-- Form / Status -->
            <div class="w-full max-w-[450px]">
                {#if submitted}
                    <div 
                        in:fade={{ duration: 300 }}
                        class="bg-emerald-50 border border-emerald-250 text-emerald-700 px-5 py-4 rounded-2xl text-sm sm:text-base font-semibold flex items-center gap-2"
                    >
                        <i class="ph-duotone ph-check-circle text-lg shrink-0"></i>
                        <span>
                            {#if languageState.current === "ID"}
                                Terima kasih! Anda telah terdaftar dalam newsletter kami.
                            {:else}
                                Thank you! You have successfully subscribed to our newsletter.
                            {/if}
                        </span>
                    </div>
                {:else}
                    <form onsubmit={handleSubmit} class="relative w-full flex items-center rounded-full border border-slate-200/80 bg-white p-1.5 pr-14 sm:pr-16">
                        <input
                            type="email"
                            placeholder={languageState.current === "ID" ? "Email Anda..." : "Enter your email..."}
                            bind:value={email}
                            class="w-full bg-transparent text-slate-900 rounded-full py-2.5 sm:py-3.5 pl-4 sm:pl-5 placeholder-slate-400 outline-none border-none focus:ring-0 focus:outline-none text-xs sm:text-base"
                        />
                        <button
                            type="submit"
                            aria-label="Submit email"
                            class="absolute right-2 w-9 h-9 sm:w-11 sm:h-11 bg-[#2B95FF] hover:bg-[#1a85f0] text-white rounded-full transition-all duration-300 hover:scale-105 focus:outline-none flex items-center justify-center cursor-pointer"
                        >
                            <i class="ph-duotone ph-arrow-right text-base sm:text-lg"></i>
                        </button>
                    </form>
                    {#if errorMsg}
                        <p class="text-rose-600 text-xs mt-2 ml-4 font-semibold">{errorMsg}</p>
                    {/if}
                {/if}
            </div>

        </div>
    </div>
</section>

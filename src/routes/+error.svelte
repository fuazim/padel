<script lang="ts">
    import { page } from "$app/stores";
    import { languageState } from "$lib/state.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";

    // Human-friendly error details
    const status = $derived($page.status || 404);
    
    // Friendly localized messages
    const isID = $derived(languageState.current === "ID");
    
    const errorDetails = $derived({
        404: {
            title: isID ? "Halaman Tidak Ditemukan" : "Page Not Found",
            desc: isID 
                ? "Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Mari kembali ke beranda untuk mulai bermain." 
                : "Sorry, the page you are looking for does not exist or has been moved. Let's head back home to start playing."
        },
        generic: {
            title: isID ? "Ada Masalah Kecil" : "Something Went Wrong",
            desc: isID
                ? "Terjadi kesalahan internal. Tim kami sedang membersihkan lapangan untuk Anda. Coba segarkan halaman atau kembali beberapa saat lagi."
                : "An unexpected error occurred. Our team is sweeps the court for you. Please refresh or try again shortly."
        }
    });

    const activeError = $derived(errorDetails[status as keyof typeof errorDetails] || errorDetails.generic);
</script>

<Navbar />

<main class="w-full min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6">
    <div class="max-w-md w-full text-center flex flex-col items-center gap-6">
        <!-- Error Code Badge (Premium, no shadows) -->
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#2B95FF]/5 border border-[#2B95FF]/10 text-[#2B95FF] text-4xl font-extrabold font-mono select-none">
            {status}
        </div>

        <div class="flex flex-col gap-2.5">
            <h1 class="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeError.title}
            </h1>
            <p class="text-slate-500 text-sm leading-relaxed font-light">
                {activeError.desc}
            </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-2 w-full justify-center">
            <a
                href="/"
                class="bg-slate-900 hover:bg-black text-white font-semibold px-8 py-3 rounded-full text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
                <i class="ph-duotone ph-house-line text-base"></i>
                <span>{isID ? "Kembali ke Beranda" : "Back to Home"}</span>
            </a>
            <button
                onclick={() => window.location.reload()}
                class="bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 font-semibold px-8 py-3 rounded-full text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
                <i class="ph-duotone ph-arrow-counter-clockwise text-base"></i>
                <span>{isID ? "Segarkan Halaman" : "Refresh Page"}</span>
            </button>
        </div>
    </div>
</main>

<Footer />

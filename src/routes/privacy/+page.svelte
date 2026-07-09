<script lang="ts">
    import { languageState } from "$lib/state.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<Navbar />

<main class="max-w-[800px] mx-auto px-4 sm:px-6 py-24 sm:py-32 font-light text-slate-600 leading-relaxed">
    <div class="flex flex-col gap-6">
        <h1 class="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            {languageState.current === "ID" ? "Kebijakan Privasi" : "Privacy Policy"}
        </h1>
        <p class="text-xs text-slate-400 font-medium tracking-wider uppercase mb-6">
            {languageState.current === "ID" ? "Terakhir Diperbarui: 9 Juli 2026" : "Last Updated: July 9, 2026"}
        </p>

        {#if languageState.current === "ID"}
            <p>
                Kami di Padel Club berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan pemesanan dan situs web kami.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">1. Informasi yang Kami Kumpulkan</h2>
            <p>
                Kami mengumpulkan data pribadi seperti nama lengkap, alamat email, nomor telepon, dan data transaksi pemesanan lapangan Anda untuk memproses transaksi penyewaan secara aman.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">2. Penggunaan Informasi</h2>
            <p>
                Data yang kami kumpulkan digunakan untuk mengelola akun keanggotaan Anda, mengonfirmasi pemesanan lapangan, mengirim pemberitahuan jadwal, serta memberikan penawaran khusus melalui buletin newsletter (jika disetujui).
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">3. Keamanan Data</h2>
            <p>
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang ketat untuk mencegah akses tanpa izin, penyalahgunaan, atau kebocoran data pribadi Anda.
            </p>
        {:else}
            <p>
                We at Padel Club are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when using our booking services and website.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">1. Information We Collect</h2>
            <p>
                We collect personal data such as your full name, email address, phone number, and court booking transaction details to process rental transactions securely.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">2. How We Use Information</h2>
            <p>
                The data we collect is used to manage your membership account, confirm court bookings, send schedule notifications, and deliver special offers through our newsletter (if consented).
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">3. Data Security</h2>
            <p>
                We implement strict technical and organizational security measures to prevent unauthorized access, misuse, or leakage of your personal data.
            </p>
        {/if}
    </div>
</main>

<Footer />

<script lang="ts">
    import { languageState } from "$lib/state.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<Navbar />

<main class="max-w-[800px] mx-auto px-4 sm:px-6 py-24 sm:py-32 font-light text-slate-600 leading-relaxed">
    <div class="flex flex-col gap-6">
        <h1 class="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
            {languageState.current === "ID" ? "Syarat & Ketentuan" : "Terms & Conditions"}
        </h1>
        <p class="text-xs text-slate-400 font-medium tracking-wider uppercase mb-6">
            {languageState.current === "ID" ? "Terakhir Diperbarui: 9 Juli 2026" : "Last Updated: July 9, 2026"}
        </p>

        {#if languageState.current === "ID"}
            <p>
                Selamat datang di Padel Club. Dengan mengakses situs web kami dan melakukan pemesanan lapangan, Anda setuju untuk mematuhi dan terikat oleh Syarat dan Ketentuan berikut.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">1. Aturan Penggunaan Lapangan</h2>
            <p>
                Pemain diwajibkan menggunakan pakaian dan sepatu olahraga yang sesuai selama bermain. Dilarang keras merusak fasilitas lapangan atau membawa benda berbahaya ke dalam area klub.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">2. Kebijakan Pembatalan</h2>
            <p>
                Pembatalan sewa lapangan harus dilakukan setidaknya 24 jam sebelum jadwal bermain yang ditentukan untuk memenuhi syarat pengembalian dana penuh atau penjadwalan ulang.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">3. Batasan Tanggung Jawab</h2>
            <p>
                Padel Club tidak bertanggung jawab atas cedera fisik, kehilangan barang pribadi, atau kerusakan harta benda yang terjadi di area fasilitas kami, kecuali disebabkan oleh kelalaian berat staf kami.
            </p>
        {:else}
            <p>
                Welcome to Padel Club. By accessing our website and making court bookings, you agree to comply with and be bound by the following Terms and Conditions.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">1. Court Rules</h2>
            <p>
                Players are required to wear appropriate sportswear and athletic shoes during play. Damaging court facilities or bringing dangerous items into the club premises is strictly prohibited.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">2. Cancellation Policy</h2>
            <p>
                Court booking cancellations must be made at least 24 hours prior to the scheduled playtime to be eligible for a full refund or rescheduling.
            </p>
            <h2 class="text-xl font-bold text-slate-800 mt-4">3. Limitation of Liability</h2>
            <p>
                Padel Club is not liable for physical injuries, loss of personal belongings, or property damages occurring within our facility, unless caused by gross negligence of our staff.
            </p>
        {/if}
    </div>
</main>

<Footer />

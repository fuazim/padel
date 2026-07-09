<script lang="ts">
    import { languageState } from "$lib/state.svelte";
</script>

<footer class="w-full bg-[#090D1A] text-slate-400 pt-16 pb-8 border-t border-white/5">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <!-- Column 1: Brand & Socials -->
            <div class="flex flex-col gap-6">
                <a href="/" class="inline-block">
                    <img
                        src="/images/logos/padel-dark.svg"
                        alt="Padel Logo"
                        class="h-8 w-auto"
                    />
                </a>
                <p class="text-sm font-light leading-relaxed text-slate-400">
                    {#if languageState.current === "ID"}
                        Bergabunglah dengan komunitas padel yang dinamis di mana minat Anda berpadu dengan performa terbaik. Cari rekan bermain, pesan lapangan dengan mudah, dan tingkatkan permainan Anda bersama kami.
                    {:else}
                        Join a vibrant padel community where your passion meets performance. Find partners, book courts with ease, and level up your game with us.
                    {/if}
                </p>
                <!-- Social Media Links (Phosphor Duotone) -->
                <div class="flex items-center gap-3">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        class="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2B95FF] hover:text-white flex items-center justify-center transition-all duration-300 group"
                    >
                        <i class="ph-duotone ph-instagram-logo text-xl text-slate-400 group-hover:text-white transition-colors"></i>
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        class="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2B95FF] hover:text-white flex items-center justify-center transition-all duration-300 group"
                    >
                        <i class="ph-duotone ph-facebook-logo text-xl text-slate-400 group-hover:text-white transition-colors"></i>
                    </a>
                    <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                        class="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2B95FF] hover:text-white flex items-center justify-center transition-all duration-300 group"
                    >
                        <i class="ph-duotone ph-tiktok-logo text-xl text-slate-400 group-hover:text-white transition-colors"></i>
                    </a>
                </div>
            </div>

            <!-- Column 2: Quick Links -->
            <div class="flex flex-col gap-6">
                <h3 class="text-white text-base font-semibold tracking-wide">
                    {languageState.current === "ID" ? "Navigasi" : "Navigation"}
                </h3>
                <ul class="flex flex-col gap-3 text-sm font-light">
                    <li>
                        <a href="/#about" class="hover:text-[#2B95FF] transition-colors">
                            {languageState.current === "ID" ? "Tentang Kami" : "About Us"}
                        </a>
                    </li>
                    <li>
                        <a href="/#services" class="hover:text-[#2B95FF] transition-colors">
                            {languageState.current === "ID" ? "Program & Layanan" : "Programs & Services"}
                        </a>
                    </li>
                    <li>
                        <a href="/#membership" class="hover:text-[#2B95FF] transition-colors">Membership</a>
                    </li>
                    <li>
                        <a href="/#testimonials" class="hover:text-[#2B95FF] transition-colors">
                            {languageState.current === "ID" ? "Testimoni" : "Testimonials"}
                        </a>
                    </li>
                </ul>
            </div>

            <!-- Column 3: Contact Details -->
            <div class="flex flex-col gap-6">
                <h3 class="text-white text-base font-semibold tracking-wide">
                    {languageState.current === "ID" ? "Kontak Kami" : "Contact Us"}
                </h3>
                <ul class="flex flex-col gap-4 text-sm font-light">
                    <li class="flex items-start gap-3">
                        <i class="ph-duotone ph-phone text-lg text-[#2B95FF] shrink-0 mt-0.5"></i>
                        <a href="tel:+6281234567890" class="hover:text-[#2B95FF] transition-colors">+62 812-3456-7890</a>
                    </li>
                    <li class="flex items-start gap-3">
                        <i class="ph-duotone ph-envelope text-lg text-[#2B95FF] shrink-0 mt-0.5"></i>
                        <a href="mailto:info@padelclub.com" class="hover:text-[#2B95FF] transition-colors">info@padelclub.com</a>
                    </li>
                    <li class="flex items-start gap-3">
                        <i class="ph-duotone ph-map-pin text-lg text-[#2B95FF] shrink-0 mt-0.5"></i>
                        <span>Jl. Padel Utama No. 45, Jakarta Selatan, Indonesia</span>
                    </li>
                </ul>
            </div>

            <!-- Column 4: Operational Hours -->
            <div class="flex flex-col gap-6">
                <h3 class="text-white text-base font-semibold tracking-wide">
                    {languageState.current === "ID" ? "Jam Operasional" : "Operational Hours"}
                </h3>
                <div class="flex flex-col gap-3 text-sm font-light">
                    <div class="flex justify-between border-b border-white/5 pb-2">
                        <span>{languageState.current === "ID" ? "Senin - Jumat:" : "Mon - Fri:"}</span>
                        <span class="text-white font-medium">06:00 - 22:00</span>
                    </div>
                    <div class="flex justify-between border-b border-white/5 pb-2">
                        <span>{languageState.current === "ID" ? "Sabtu - Minggu:" : "Sat - Sun:"}</span>
                        <span class="text-white font-medium">06:00 - 23:00</span>
                    </div>
                    <p class="text-xs text-slate-500 italic mt-2">
                        {#if languageState.current === "ID"}
                            *Jam operasional lapangan dapat berubah saat libur nasional.
                        {:else}
                            *Operational hours may change during national holidays.
                        {/if}
                    </p>
                </div>
            </div>

        </div>

        <!-- Divider Line -->
        <div class="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light">
            <p>&copy; {new Date().getFullYear()} Padel Club. All rights reserved.</p>
            <div class="flex gap-6">
                <a href="/privacy" class="hover:text-white transition-colors">
                    {languageState.current === "ID" ? "Kebijakan Privasi" : "Privacy Policy"}
                </a>
                <a href="/terms" class="hover:text-white transition-colors">
                    {languageState.current === "ID" ? "Syarat & Ketentuan" : "Terms & Conditions"}
                </a>
            </div>
        </div>
    </div>
</footer>

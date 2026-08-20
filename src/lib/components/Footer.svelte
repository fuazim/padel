<script lang="ts">
    import { languageState } from "$lib/state.svelte";
    import { siteConfig } from "$lib/config/site";
</script>

<footer class="w-full bg-[#090D1A] text-slate-400 pt-16 pb-8 border-t border-white/5">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <!-- Column 1: Brand & Socials -->
            <div class="flex flex-col gap-6">
                <a href="/" class="inline-block">
                    <img
                        src="/images/logos/padel-dark.svg"
                        alt="{siteConfig.name} Logo"
                        class="h-8 w-auto"
                    />
                </a>
                <p class="text-sm font-light leading-relaxed text-slate-400">
                    {#if languageState.current === "ID"}
                        {siteConfig.description.id}
                    {:else}
                        {siteConfig.description.en}
                    {/if}
                </p>
                <!-- Social Media Links (Phosphor Duotone) -->
                <div class="flex items-center gap-3">
                    {#if siteConfig.social.instagram}
                    <a
                        href={siteConfig.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        class="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2B95FF] hover:text-white flex items-center justify-center transition-all duration-300 group"
                    >
                        <i class="ph-duotone ph-instagram-logo text-xl text-slate-400 group-hover:text-white transition-colors"></i>
                    </a>
                    {/if}
                    {#if siteConfig.social.facebook}
                    <a
                        href={siteConfig.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        class="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2B95FF] hover:text-white flex items-center justify-center transition-all duration-300 group"
                    >
                        <i class="ph-duotone ph-facebook-logo text-xl text-slate-400 group-hover:text-white transition-colors"></i>
                    </a>
                    {/if}
                    {#if siteConfig.social.tiktok}
                    <a
                        href={siteConfig.social.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                        class="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2B95FF] hover:text-white flex items-center justify-center transition-all duration-300 group"
                    >
                        <i class="ph-duotone ph-tiktok-logo text-xl text-slate-400 group-hover:text-white transition-colors"></i>
                    </a>
                    {/if}
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
                        <a href="tel:{siteConfig.contact.phone.replace(/[^0-9+]/g, '')}" class="hover:text-[#2B95FF] transition-colors">{siteConfig.contact.phone}</a>
                    </li>
                    <li class="flex items-start gap-3">
                        <i class="ph-duotone ph-envelope text-lg text-[#2B95FF] shrink-0 mt-0.5"></i>
                        <a href="mailto:{siteConfig.contact.email}" class="hover:text-[#2B95FF] transition-colors">{siteConfig.contact.email}</a>
                    </li>
                    <li class="flex items-start gap-3">
                        <i class="ph-duotone ph-map-pin text-lg text-[#2B95FF] shrink-0 mt-0.5"></i>
                        <span>{siteConfig.contact.address}</span>
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
                        <span class="text-white font-medium">{siteConfig.hours.weekday}</span>
                    </div>
                    <div class="flex justify-between border-b border-white/5 pb-2">
                        <span>{languageState.current === "ID" ? "Sabtu - Minggu:" : "Sat - Sun:"}</span>
                        <span class="text-white font-medium">{siteConfig.hours.weekend}</span>
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
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
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

<script lang="ts">
    const socialLinks = [
        { name: "Instagram", href: "#" },
        { name: "Facebook", href: "#" },
        { name: "TikTok", href: "#" },
        { name: "YouTube", href: "#" },
    ];

    const navLinks = [
        { name: "Tentang Kami", href: "#about" },
        { name: "Program & Layanan", href: "#services" },
        { name: "Membership", href: "#membership" },
        { name: "Testimoni", href: "#testimonials" },
    ];

    const currentYear = new Date().getFullYear();
</script>

<footer class="w-full bg-[#0A1628] text-white">
    <!-- Top Section -->
    <div
        class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-12 md:pb-16"
    >
        <div
            class="flex flex-col lg:flex-row justify-between gap-10 lg:gap-20 pb-12 md:pb-16 border-b border-white/10"
        >
            <!-- Left: Tagline & CTA -->
            <div class="max-w-xl">
                <p
                    class="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8"
                >
                    Bergabunglah dengan komunitas padel yang dinamis, tempat
                    perjalananmu menuju skill yang lebih baik dan pertemanan
                    baru dimulai hari ini.
                </p>
                <a
                    href="#membership"
                    class="inline-block bg-[#2B95FF] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-[#1a7fe6] transition-all"
                >
                    Beli Membership
                </a>
            </div>

            <!-- Right: Social Links -->
            <div class="flex flex-col items-start lg:items-end">
                <p class="text-sm text-white/60 mb-4 tracking-wide">
                    Ikuti Kami
                </p>
                <div class="flex flex-wrap gap-3">
                    {#each socialLinks as social}
                        <a
                            href={social.href}
                            class="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0A1628] text-sm font-medium hover:bg-white/90 transition-colors"
                        >
                            {social.name}
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
                        </a>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Bottom Section -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 pt-12 md:pt-16"
        >
            <!-- Logo -->
            <div class="flex items-start">
                <a href="/">
                    <img
                        src="/images/logos/padel-dark.svg"
                        alt="Padel Logo"
                        class="h-10 w-auto"
                    />
                </a>
            </div>

            <!-- Navigation -->
            <div>
                <p class="text-sm text-white/60 mb-5 tracking-wide">Menu</p>
                <ul class="space-y-3">
                    {#each navLinks as link}
                        <li>
                            <a
                                href={link.href}
                                class="text-white/80 hover:text-white transition-colors text-base"
                            >
                                {link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- Contact -->
            <div>
                <p class="text-sm text-white/60 mb-5 tracking-wide">Kontak</p>
                <div class="space-y-3 text-white/80">
                    <p>
                        Jl. Padel Raya No. 123<br />
                        Jakarta Selatan, 12345
                    </p>
                    <p>Buka setiap hari: 07:00 - 22:00</p>
                    <p>(021) 555-7890</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Copyright Bar -->
    <div class="border-t border-white/10">
        <div
            class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4"
        >
            <p class="text-sm text-white/50">
                © {currentYear} Padel. Hak Cipta Dilindungi.
            </p>
            <a
                href="#"
                class="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
                Kebijakan Privasi
            </a>
        </div>
    </div>
</footer>

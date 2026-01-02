<script lang="ts">
    import { slide } from "svelte/transition";

    let openIndex: number | null = null;

    const faqs = [
        {
            question: "Paket membership apa yang cocok untuk pemain kasual?",
            answer: "Untuk pemain kasual, kami merekomendasikan paket Basic yang memberikan akses 4 sesi kelas grup dan 2 jam penggunaan lapangan per bulan. Paket ini ideal bagi Anda yang ingin bermain santai sambil tetap meningkatkan kemampuan.",
        },
        {
            question: "Bagaimana cara mengetahui level kemampuan saya?",
            answer: "Tim pelatih kami akan melakukan asesmen gratis saat Anda pertama kali bergabung. Anda akan bermain beberapa game pendek dan pelatih akan mengevaluasi teknik, konsistensi, dan pemahaman taktik Anda untuk menentukan level yang sesuai.",
        },
        {
            question: "Apakah saya perlu membawa peralatan sendiri?",
            answer: "Tidak perlu! Kami menyediakan raket dan bola berkualitas untuk semua member. Namun, jika Anda memiliki raket sendiri, silakan membawanya. Kami juga menyediakan layanan rental peralatan premium dengan biaya tambahan.",
        },
        {
            question: "Apa keuntungan menjadi member Pro?",
            answer: "Member Pro mendapatkan akses unlimited ke seluruh kelas grup, prioritas booking lapangan, 4 sesi private lesson per bulan, serta akses ke semua turnamen yang kami selenggarakan. Perfect untuk Anda yang serius ingin meningkatkan permainan.",
        },
        {
            question: "Bagaimana jika saya perlu membekukan membership?",
            answer: "Kami memahami bahwa terkadang ada situasi yang mengharuskan Anda berhenti sementara. Anda dapat membekukan membership hingga 30 hari per tahun tanpa biaya tambahan. Cukup hubungi tim kami minimal 3 hari sebelumnya.",
        },
        {
            question: "Apakah ada program khusus untuk senior?",
            answer: "Ya! Kami memiliki program Senior Padel khusus untuk usia 55 tahun ke atas. Program ini dirancang dengan intensitas yang disesuaikan, fokus pada teknik dan strategi, serta lingkungan yang ramah dan suportif.",
        },
    ];

    function toggleFaq(index: number) {
        if (openIndex === index) {
            openIndex = null;
        } else {
            openIndex = index;
        }
    }
</script>

<section
    id="faq"
    class="w-full bg-[#F4F9FF] rounded-4xl md:rounded-[4rem] pt-12 pb-8 md:pt-20 md:pb-12"
>
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-10 md:mb-16">
            <!-- FAQ Badge -->
            <div class="lg:w-1/4">
                <div
                    class="inline-block px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide bg-white"
                >
                    FAQ
                </div>
            </div>

            <!-- Title -->
            <div class="lg:w-3/4">
                <h2
                    class="text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-black"
                >
                    Kami telah mengumpulkan pertanyaan yang sering diajukan.
                    Temukan jawaban yang jelas agar tidak ada yang tertinggal.
                </h2>
            </div>
        </div>

        <!-- Content Section -->
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <!-- Image -->
            <div class="lg:w-1/3 w-full lg:self-stretch">
                <div class="rounded-3xl overflow-hidden h-full max-h-[500px]">
                    <img
                        src="/images/images/faq-image.png"
                        alt="Pemain Padel"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div class="lg:w-2/3 w-full flex flex-col gap-3">
                {#each faqs as faq, index}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="bg-white rounded-2xl overflow-hidden transition-all duration-300 {openIndex ===
                        index
                            ? 'shadow-md'
                            : 'shadow-sm hover:shadow-md'}"
                    >
                        <div
                            class="flex items-center justify-between p-3 md:p-4 cursor-pointer"
                            onclick={() => toggleFaq(index)}
                        >
                            <span
                                class="text-base md:text-lg font-medium text-gray-800 pr-4"
                            >
                                {faq.question}
                            </span>
                            <button
                                aria-label={openIndex === index
                                    ? "Tutup jawaban"
                                    : "Buka jawaban"}
                                class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 {openIndex ===
                                index
                                    ? 'bg-gray-200 text-black rotate-45'
                                    : 'text-gray-600 hover:bg-gray-200'}"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    class="w-5 h-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                            </button>
                        </div>

                        {#if openIndex === index}
                            <div
                                class="px-5 md:px-6 pb-5 md:pb-6"
                                transition:slide={{ duration: 300 }}
                            >
                                <p
                                    class="text-gray-600 font-light leading-relaxed"
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <!-- Bottom CTA -->
        <div
            class="flex flex-col md:flex-row items-start md:items-center justify-between mt-6 md:mt-8 pt-4"
        >
            <p
                class="text-lg md:text-xl text-gray-700 font-normal mb-4 md:mb-0"
            >
                Masih ada pertanyaan lain?
            </p>
            <button
                class="bg-[#2B95FF] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-[#1a7fe6] transition-all inline-flex items-center gap-2 group"
            >
                Hubungi Kami
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                </svg>
            </button>
        </div>
    </div>
</section>

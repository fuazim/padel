<script lang="ts">
    import { slide } from "svelte/transition";
    import { currentLanguage } from "$lib/stores/language";

    let activePlan = "pro";

    const texts = {
        id: {
            badge: "Memberships",
            heading:
                "Tiga pilihan membership untuk meningkatkan kualitas permainanmu.",
            subheading:
                "Manfaat eksklusif. Pengalaman premium. Satu pilihan yang tepat.",
            buyMembership: "Buy membership",
            viewFeatures: "View Features",
            mostPopular: "Most Popular Plan",
            perMonth: "/month",
            plans: [
                {
                    id: "pro",
                    name: "Pro Membership",
                    price: "120$",
                    features: [
                        "Unlimited group classes",
                        "Priority booking",
                        "4 private lessons",
                        "All tournament access",
                    ],
                    isPopular: true,
                },
                {
                    id: "elite",
                    name: "Elite Plan",
                    price: "200$",
                    features: [
                        "8 group classes",
                        "4 court hours",
                        "2 private lesson",
                        "Club tournament access",
                    ],
                    isPopular: false,
                },
                {
                    id: "basic",
                    name: "Basic Plan",
                    price: "80$",
                    features: [
                        "4 group classes",
                        "2 court hours",
                        "Equipment rental included",
                    ],
                    isPopular: false,
                },
            ],
        },
        en: {
            badge: "Memberships",
            heading: "Three membership options to improve your game quality.",
            subheading:
                "Exclusive benefits. Premium experience. The right choice.",
            buyMembership: "Buy membership",
            viewFeatures: "View Features",
            mostPopular: "Most Popular Plan",
            perMonth: "/month",
            plans: [
                {
                    id: "pro",
                    name: "Pro Membership",
                    price: "120$",
                    features: [
                        "Unlimited group classes",
                        "Priority booking",
                        "4 private lessons",
                        "All tournament access",
                    ],
                    isPopular: true,
                },
                {
                    id: "elite",
                    name: "Elite Plan",
                    price: "200$",
                    features: [
                        "8 group classes",
                        "4 court hours",
                        "2 private lessons",
                        "Club tournament access",
                    ],
                    isPopular: false,
                },
                {
                    id: "basic",
                    name: "Basic Plan",
                    price: "80$",
                    features: [
                        "4 group classes",
                        "2 court hours",
                        "Equipment rental included",
                    ],
                    isPopular: false,
                },
            ],
        },
    };

    $: t = texts[$currentLanguage];
    $: plans = t.plans;
</script>

<section
    id="membership"
    class="w-full bg-[#F4F9FF] rounded-4xl md:rounded-[4rem] pt-12 pb-8 md:pt-20 md:pb-4"
>
    <div class="max-w-[1400px] mx-auto px-8 sm:px-6 lg:px-8">
        <!-- Mobile Layout uses flex with order, Desktop uses grid -->
        <div
            class="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-12 lg:gap-24 items-start"
        >
            <!-- Badge - Order 1 on mobile -->
            <div
                class="order-1 lg:order-none lg:hidden inline-block px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide bg-white"
            >
                {t.badge}
            </div>

            <!-- Left Column: Membership Cards - Order 2 on mobile -->
            <div
                class="order-2 lg:order-none flex flex-col gap-4 md:gap-6 lg:col-span-3 w-full"
            >
                {#each plans as plan}
                    <!-- Card Container -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="rounded-2xl md:rounded-[2.5rem] transition-all duration-500 ease-in-out cursor-pointer overflow-hidden w-full flex flex-col justify-center
                        {activePlan === plan.id
                            ? 'bg-[#2B95FF] text-white p-8 md:p-10 shadow-sm'
                            : 'bg-white text-gray-800 p-6 md:p-8 shadow-sm border border-gray-100 hover:border-[#2B95FF]/30'}"
                        onclick={() => (activePlan = plan.id)}
                    >
                        {#if activePlan === plan.id}
                            <!-- EXPANDED STATE (Active) -->
                            <div
                                class="flex flex-col h-full justify-between gap-8 w-full"
                                transition:slide={{ duration: 500 }}
                            >
                                <!-- Top Section -->
                                <div
                                    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                >
                                    {#if plan.isPopular}
                                        <div
                                            class="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white tracking-wide border border-white/20"
                                        >
                                            {t.mostPopular}
                                        </div>
                                    {:else}
                                        <div></div>
                                    {/if}
                                    <div class="flex items-baseline">
                                        <span
                                            class="text-4xl md:text-5xl font-medium tracking-tight"
                                            >{plan.price}</span
                                        >
                                        <span
                                            class="text-white/80 text-sm font-light ml-1"
                                            >{t.perMonth}</span
                                        >
                                    </div>
                                </div>

                                <!-- Title & Features -->
                                <div>
                                    <h3
                                        class="text-3xl md:text-4xl font-normal tracking-tight mb-6"
                                    >
                                        {plan.name}
                                    </h3>

                                    <div class="flex flex-wrap gap-2 md:gap-3">
                                        {#each plan.features as feature}
                                            <span
                                                class="inline-flex items-center px-4 py-2 rounded-full border border-white/30 text-sm font-light bg-white/10 backdrop-blur-sm"
                                            >
                                                ✦ {feature}
                                            </span>
                                        {/each}
                                    </div>
                                </div>

                                <!-- CTA Button -->
                                <div>
                                    <button
                                        class="bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-gray-900 transition-all inline-flex items-center gap-2 group shadow-lg"
                                    >
                                        {t.buyMembership}
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
                        {:else}
                            <!-- COLLAPSED STATE (Inactive) -->
                            <div
                                class="w-full flex items-center justify-between"
                                transition:slide={{ duration: 500 }}
                            >
                                <h3
                                    class="text-xl md:text-2xl font-normal text-gray-800"
                                >
                                    {plan.name}
                                </h3>
                                <button
                                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-600/10 text-gray-700 text-sm font-medium hover:bg-gray-600/20 transition-all group-hover:text-black"
                                >
                                    {t.viewFeatures}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        class="w-4 h-4"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                        />
                                    </svg>
                                </button>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <!-- Icon - Order 3 on mobile (centered) -->
            <div
                class="order-3 lg:hidden w-full flex justify-center pointer-events-none py-4"
            >
                <svg
                    height="512"
                    viewBox="0 0 56 41"
                    width="512"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-20 h-20 opacity-80"
                >
                    <g id="Page-1" fill="none" fill-rule="evenodd">
                        <g id="018---Court" fill="#0099FF" fill-rule="nonzero">
                            <path
                                id="Shape"
                                d="m27 21v11h-15.171l3.071-11zm14.1 0 3.07 11h-15.17v-11zm-29.829 13h33.458l1.954 7h-37.366zm37.488 7-5.582-20h5.123l6.784 18.658c.111539.3064711.0666207.6480792-.1203532.9152987-.186974.2672194-.4925097.426473-.8186468.4267013zm-8.189-40.367 3.701 9.367h-4.163l-2.791-10h2.323c.4105475.00009071.7793291.25110009.93.633zm-22.603 9.367 1.4-5h7.633v5zm17.274-10 .838 3h-16.158l.838-3zm-6.241 5h7.637l1.4 5h-9.037zm-12.639-5h2.322l-2.791 10h-4.162l3.7-9.367c.1508048-.38223951.5200876-.63332008.931-.633zm-10.361 13c0-.5522847.44771525-1 1-1h42c.5522847 0 1 .4477153 1 1v5c0 .5522847-.4477153 1-1 1h-42c-.55228475 0-1-.4477153-1-1zm1.7 8h5.123l-5.582 20h-5.386c-.32613715-.0002283-.63167281-.1594819-.81864677-.4267013-.18697396-.2672195-.23189224-.6088276-.12035323-.9152987z"
                            />
                        </g>
                    </g>
                </svg>
            </div>

            <!-- Title - Order 4 on mobile -->
            <div class="order-4 lg:order-none max-w-xl lg:hidden pb-4">
                <h2
                    class="text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-black mb-3"
                >
                    {t.heading}
                </h2>
                <p class="text-gray-500 text-base font-light leading-relaxed">
                    {t.subheading}
                </p>
            </div>

            <!-- Right Column: Desktop Only -->
            <div
                class="hidden lg:flex flex-col items-start justify-center gap-4 lg:sticky lg:top-24 h-full lg:col-span-2"
            >
                <div
                    class="inline-block px-5 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 tracking-wide bg-white"
                >
                    {t.badge}
                </div>

                <div class="max-w-xl">
                    <h2
                        class="text-3xl md:text-4xl lg:text-[2.5rem] leading-snug font-normal text-black mb-6"
                    >
                        {t.heading}
                    </h2>
                    <p class="text-gray-500 text-xl font-light leading-relaxed">
                        {t.subheading}
                    </p>
                </div>

                <!-- Background Illustration - Desktop only -->
                <div
                    class="w-full flex justify-center pointer-events-none -mt-24 -mb-2"
                >
                    <svg
                        height="512"
                        viewBox="0 0 56 41"
                        width="512"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-full max-w-[200px]"
                    >
                        <g id="Page-1" fill="none" fill-rule="evenodd">
                            <g
                                id="018---Court"
                                fill="#0099FF"
                                fill-rule="nonzero"
                            >
                                <path
                                    id="Shape"
                                    d="m27 21v11h-15.171l3.071-11zm14.1 0 3.07 11h-15.17v-11zm-29.829 13h33.458l1.954 7h-37.366zm37.488 7-5.582-20h5.123l6.784 18.658c.111539.3064711.0666207.6480792-.1203532.9152987-.186974.2672194-.4925097.426473-.8186468.4267013zm-8.189-40.367 3.701 9.367h-4.163l-2.791-10h2.323c.4105475.00009071.7793291.25110009.93.633zm-22.603 9.367 1.4-5h7.633v5zm17.274-10 .838 3h-16.158l.838-3zm-6.241 5h7.637l1.4 5h-9.037zm-12.639-5h2.322l-2.791 10h-4.162l3.7-9.367c.1508048-.38223951.5200876-.63332008.931-.633zm-10.361 13c0-.5522847.44771525-1 1-1h42c.5522847 0 1 .4477153 1 1v5c0 .5522847-.4477153 1-1 1h-42c-.55228475 0-1-.4477153-1-1zm1.7 8h5.123l-5.582 20h-5.386c-.32613715-.0002283-.63167281-.1594819-.81864677-.4267013-.18697396-.2672195-.23189224-.6088276-.12035323-.9152987z"
                                />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</section>

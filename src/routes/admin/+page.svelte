<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";
    import Skeleton from "$lib/components/Skeleton.svelte";
    import type ApexCharts from "apexcharts";

    let { data } = $props();

    // Reusable states
    let ApexChartsClass: any = $state(null);

    // Reusable states
    let isLoading = $state(true);
    let isEmpty = $state(false);
    let timeRange = $state("7"); // "7" or "30" days
    let selectedMetric = $state("Revenue"); // "Revenue", "Bookings", "Members", "Newsletter"

    // Dynamic stats computed from database or localstorage fallback
    const stats = $derived.by(() => {
        let rev = 0;
        let todayB = 0;
        let membersVal = 348;
        let newsVal = 1254;

        if (data && data.dbSuccess && data.bookings) {
            const paidBookings = data.bookings.filter((b: any) => b.status === "Paid");
            rev = paidBookings.reduce((sum: number, b: any) => sum + b.amount, 0);

            const todayStr = new Date().toISOString().split("T")[0];
            todayB = data.bookings.filter((b: any) => b.date === todayStr || b.date === "Today" || b.date === "2026-07-09").length;

            membersVal = data.membersCount;
            newsVal = data.newsletterCount;
        } else {
            try {
                const saved = localStorage.getItem("custom_admin_bookings");
                if (saved) {
                    const localB = JSON.parse(saved);
                    const paid = localB.filter((b: any) => b.status === "Paid");
                    rev = paid.reduce((sum: number, b: any) => sum + b.amount, 0);
                    todayB = localB.filter((b: any) => b.date === "Today").length;
                } else {
                    rev = 24850000;
                    todayB = 14;
                }
                
                const savedMembers = localStorage.getItem("custom_members");
                if (savedMembers) {
                    membersVal = JSON.parse(savedMembers).length;
                }
                
                const savedNews = localStorage.getItem("newsletter_emails");
                if (savedNews) {
                    newsVal = JSON.parse(savedNews).length;
                }
            } catch (_) {}
        }

        return [
            {
                title: "Total Revenue",
                titleID: "Total Pendapatan",
                value: "Rp " + rev.toLocaleString("id-ID"),
                diff: "+12%",
                positive: true,
                iconClass: "ph-duotone ph-money text-2xl text-[#2B95FF]"
            },
            {
                title: "Today Bookings",
                titleID: "Booking Hari Ini",
                value: todayB + " Bookings",
                diff: "+4%",
                positive: true,
                iconClass: "ph-duotone ph-calendar-check text-2xl text-[#FFA800]"
            },
            {
                title: "Active Members",
                titleID: "Member Aktif",
                value: membersVal + " Members",
                diff: "+18%",
                positive: true,
                iconClass: "ph-duotone ph-users text-2xl text-emerald-600"
            },
            {
                title: "Newsletter Subs",
                titleID: "Subskripsi Newsletter",
                value: newsVal + " Emails",
                diff: "+8%",
                positive: true,
                iconClass: "ph-duotone ph-envelope-simple text-2xl text-purple-500"
            }
        ];
    });

    // Mock recent bookings list
    const originalBookings = [
        { id: "BK-890", name: "Fauzi Anwar", court: "Court Alpha (Indoor)", date: "Today", time: "18:00 - 20:00", amount: 360000, status: "Paid" },
        { id: "BK-889", name: "Rian Hidayat", court: "Court Beta (Outdoor)", date: "Today", time: "16:00 - 17:00", amount: 130000, status: "Paid" },
        { id: "BK-888", name: "Nadia Putri", court: "Court Arena (Championship)", date: "Tomorrow", time: "19:00 - 21:00", amount: 440000, status: "Pending" },
        { id: "BK-887", name: "Daniel Surya", court: "Court Alpha (Indoor)", date: "Tomorrow", time: "08:00 - 10:00", amount: 360000, status: "Paid" },
        { id: "BK-886", name: "Maya Rahman", court: "Court Beta (Outdoor)", date: "11 Jul", time: "10:00 - 12:00", amount: 260000, status: "Cancelled" }
    ];

    let bookingsList = $state<any[]>([]);
    let bookings = $derived(isEmpty ? [] : bookingsList);

    // Chart element and instance
    let chartContainer: HTMLDivElement | null = $state(null);
    let chartInstance: ApexCharts | null = null;

    onMount(() => {
        import("apexcharts").then(module => {
            ApexChartsClass = module.default;
        }).catch(() => {});

        if (data && data.dbSuccess && data.bookings) {
            bookingsList = data.bookings.slice(0, 5);
        } else {
            try {
                const saved = localStorage.getItem("custom_admin_bookings");
                if (saved) {
                    bookingsList = JSON.parse(saved).slice(0, 5);
                } else {
                    bookingsList = originalBookings;
                    localStorage.setItem("custom_admin_bookings", JSON.stringify(originalBookings));
                }
            } catch (_) {
                bookingsList = originalBookings;
            }
        }

        // Mock API loading state
        const timer = setTimeout(() => {
            isLoading = false;
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (chartInstance) chartInstance.destroy();
        };
    });

    // Chart update trigger
    $effect(() => {
        if (!isLoading && chartContainer && ApexChartsClass) {
            renderChart();
        }
    });

    function renderChart() {
        const isID = languageState.current === "ID";
        
        // Dynamic data depending on selectedMetric
        let seriesData = [12, 18, 15, 24, 28, 32, 45];
        let categories = isID 
            ? ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
            : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let chartColor = "#2B95FF";
        let seriesName = "Bookings";
        let yaxisFormatter = (val: number) => `${val}`;

        if (isEmpty) {
            seriesData = [0, 0, 0, 0, 0, 0, 0];
        } else if (selectedMetric === "Revenue") {
            chartColor = "#2B95FF";
            seriesName = isID ? "Pendapatan" : "Revenue";
            yaxisFormatter = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;
            if (timeRange === "30") {
                seriesData = [450, 520, 380, 240, 330, 260, 210, 200, 60, 80, 150, 100, 210, 240, 280, 320, 450, 520, 380, 240, 330, 260, 210, 200, 60, 80, 150, 100, 210, 300].map(v => v * 100);
            } else {
                seriesData = [1500000, 2100000, 1800000, 2400000, 2800000, 3600000, 4800000];
            }
        } else if (selectedMetric === "Bookings") {
            chartColor = "#FFA800";
            seriesName = "Bookings";
            yaxisFormatter = (val: number) => `${val} Bookings`;
            if (timeRange === "30") {
                seriesData = [15, 22, 18, 14, 13, 16, 21, 20, 6, 8, 15, 10, 21, 24, 28, 32, 45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10, 21, 30];
            } else {
                seriesData = [12, 18, 15, 24, 28, 32, 45];
            }
        } else if (selectedMetric === "Members") {
            chartColor = "#10B981";
            seriesName = isID ? "Anggota Baru" : "New Members";
            yaxisFormatter = (val: number) => `${val} Members`;
            if (timeRange === "30") {
                seriesData = [2, 5, 3, 4, 1, 2, 6, 4, 1, 3, 2, 5, 3, 2, 4, 1, 3, 5, 2, 3, 4, 2, 1, 3, 2, 4, 1, 3, 5, 6];
            } else {
                seriesData = [3, 5, 2, 6, 4, 8, 12];
            }
        } else if (selectedMetric === "Newsletter") {
            chartColor = "#8B5CF6";
            seriesName = isID ? "Subskripsi Baru" : "New Subscribers";
            yaxisFormatter = (val: number) => `${val} Emails`;
            if (timeRange === "30") {
                seriesData = [10, 12, 15, 8, 9, 14, 20, 18, 5, 6, 12, 10, 15, 16, 18, 22, 25, 30, 22, 18, 20, 15, 12, 10, 8, 11, 14, 12, 15, 25];
            } else {
                seriesData = [8, 12, 10, 15, 18, 22, 30];
            }
        }

        if (timeRange === "30") {
            categories = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        }

        const options = {
            chart: {
                type: "area" as const,
                height: 280,
                toolbar: { show: false },
                sparkline: { enabled: false },
                parentHeightOffset: 0
            },
            dataLabels: {
                enabled: false
            },
            series: [{
                name: seriesName,
                data: seriesData
            }],
            stroke: {
                curve: "smooth" as const,
                width: 3.5,
                colors: [chartColor]
            },
            fill: {
                type: "gradient" as const,
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.35,
                    opacityTo: 0.02,
                    stops: [0, 100],
                    colorStops: []
                }
            },
            markers: {
                size: isEmpty ? 0 : 5,
                colors: [chartColor],
                strokeColors: "#fff",
                strokeWidth: 2,
                hover: { size: 7 }
            },
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        colors: "#94a3b8",
                        fontSize: "11px",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500
                    }
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#94a3b8",
                        fontSize: "11px",
                        fontFamily: "Inter, sans-serif"
                    },
                    formatter: (val: number) => {
                        if (selectedMetric === "Revenue") return `Rp ${(val/1000).toLocaleString("id-ID")}k`;
                        return `${val}`;
                    }
                }
            },
            grid: {
                borderColor: "#f1f5f9",
                strokeDashArray: 5,
                padding: { left: 10, right: 10, top: 0, bottom: 0 }
            },
            colors: [chartColor],
            tooltip: {
                theme: "light" as any,
                x: { show: true },
                y: {
                    formatter: yaxisFormatter
                }
            }
        };

        if (chartInstance) {
            chartInstance.destroy();
        }

        if (chartContainer && ApexChartsClass) {
            chartInstance = new ApexChartsClass(chartContainer, options);
            chartInstance?.render();
        }
    }

    // Toggle range selection
    function setRange(range: string) {
        timeRange = range;
        if (!isLoading) {
            // Wait slightly for DOM update before rerendering
            setTimeout(renderChart, 50);
        }
    }

    // Toggle mock empty state
    function toggleEmptyState() {
        isEmpty = !isEmpty;
        if (!isLoading) {
            setTimeout(renderChart, 50);
        }
    }
</script>

<div class="flex flex-col gap-8 text-slate-600" in:fade={{ duration: 300 }}>
    
    <!-- Title Section -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 class="text-slate-900 text-2xl font-bold tracking-tight">
                {languageState.current === "ID" ? "Ringkasan Dashboard" : "Dashboard Overview"}
            </h1>
            <p class="text-sm font-light text-slate-400 mt-1">
                {languageState.current === "ID" ? "Status operasional klub hari ini." : "Daily stats and overview of the club."}
            </p>
        </div>
        <div class="flex items-center gap-3">
            <!-- Simulated controls to test states -->
            <button
                onclick={toggleEmptyState}
                class="px-4 py-2 border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-semibold rounded-full cursor-pointer transition-colors bg-white flex items-center gap-2"
            >
                <i class="ph-duotone ph-toggle-left text-base {isEmpty ? 'text-[#2B95FF] rotate-180' : 'text-slate-400'}"></i>
                <span>{isEmpty ? "Restore Data" : "Test Empty State"}</span>
            </button>
        </div>
    </div>

    <!-- Stats Grid (Skeleton loading handled) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each stats as stat}
            {@const metricType = stat.title.includes("Revenue") ? "Revenue" : stat.title.includes("Bookings") ? "Bookings" : stat.title.includes("Members") ? "Members" : "Newsletter"}
            {@const isSelected = selectedMetric === metricType}
            <button
                onclick={() => { if (!isLoading) selectedMetric = metricType; }}
                disabled={isLoading}
                class="bg-white border text-left p-6 rounded-[1.5rem] flex items-center justify-between transition-all w-full {!isLoading ? 'hover:bg-slate-50/50 hover:border-slate-350 cursor-pointer' : ''} {isSelected ? 'border-[#2B95FF] ring-2 ring-[#2B95FF]/5' : 'border-slate-200'}"
            >
                <div class="flex flex-col gap-2 w-2/3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {languageState.current === "ID" ? stat.titleID : stat.title}
                    </span>
                    {#if isLoading}
                        <Skeleton width="100px" height="28px" />
                        <Skeleton width="80px" height="16px" />
                    {:else}
                        <span class="text-slate-900 text-xl sm:text-2xl font-bold tracking-tight">
                            {isEmpty ? (stat.title.includes("Revenue") ? "Rp 0" : "0") : stat.value}
                        </span>
                        <span class="text-xs font-light flex items-center gap-1">
                            <span class="text-emerald-600 font-semibold">{isEmpty ? "+0%" : stat.diff}</span>
                            <span class="text-slate-400">vs last month</span>
                        </span>
                    {/if}
                </div>
                {#if isLoading}
                    <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <Skeleton circle={true} width="32px" height="32px" />
                    </div>
                {:else}
                    <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                        <i class={stat.iconClass}></i>
                    </div>
                {/if}
            </button>
        {/each}
    </div>

    <!-- Chart & Bookings Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Weekly Chart (2 cols) -->
        <div class="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6">
            <div class="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 class="text-slate-900 text-lg font-semibold">
                    {languageState.current === "ID" ? "Tren Aktivitas Booking" : "Bookings Activity Trend"}
                </h3>
                <div class="flex gap-1.5 bg-slate-50 p-1 rounded-full border border-slate-100">
                    <button
                        onclick={() => setRange("7")}
                        class="text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-colors {timeRange === '7' ? 'bg-[#2B95FF] text-white' : 'text-slate-400 hover:text-slate-700'}"
                    >
                        7 Days
                    </button>
                    <button
                        onclick={() => setRange("30")}
                        class="text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-colors {timeRange === '30' ? 'bg-[#2B95FF] text-white' : 'text-slate-400 hover:text-slate-700'}"
                    >
                        30 Days
                    </button>
                </div>
            </div>
            
            <!-- Graphic Line Chart using ApexCharts -->
            <div class="w-full relative min-h-[280px] flex flex-col justify-center">
                {#if isLoading}
                    <div class="p-4 flex flex-col gap-3">
                        <Skeleton height="20px" width="40%" />
                        <Skeleton height="180px" />
                    </div>
                {:else}
                    <!-- Chart container div - ApexCharts binds here and spans fully -->
                    <div bind:this={chartContainer} class="w-full"></div>
                {/if}
            </div>
        </div>

        <!-- Right: Operational Status (1 col) -->
        <div class="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6">
            <h3 class="text-slate-900 text-lg font-semibold border-b border-slate-100 pb-4">
                {languageState.current === "ID" ? "Ketersediaan Lapangan" : "Court Occupancy"}
            </h3>
            
            {#if isLoading}
                <div class="flex flex-col gap-6">
                    {#each Array(3) as _}
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between">
                                <Skeleton width="120px" />
                                <Skeleton width="70px" />
                            </div>
                            <Skeleton height="8px" />
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="flex flex-col gap-4 text-sm font-light">
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between">
                            <span class="text-slate-660 font-medium">Court Alpha (Indoor)</span>
                            <span class="text-emerald-600 font-bold">{isEmpty ? '0%' : '80%'} Occupied</span>
                        </div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 transition-all duration-500" style="width: {isEmpty ? 0 : 80}%"></div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between">
                            <span class="text-slate-660 font-medium">Court Beta (Outdoor)</span>
                            <span class="text-[#FFA800] font-bold">{isEmpty ? '0%' : '45%'} Occupied</span>
                        </div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-[#FFA800] transition-all duration-500" style="width: {isEmpty ? 0 : 45}%"></div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between">
                            <span class="text-slate-660 font-medium">Court Arena (Pro)</span>
                            <span class="text-[#2B95FF] font-bold">{isEmpty ? '0%' : '95%'} Occupied</span>
                        </div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-[#2B95FF] transition-all duration-500" style="width: {isEmpty ? 0 : 95}%"></div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Operational notice -->
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-light leading-relaxed flex items-start gap-2 text-slate-500 mt-auto">
                <i class="ph-duotone ph-megaphone text-base text-[#FFA800] shrink-0 mt-0.5"></i>
                <div>
                    <span class="font-bold text-slate-800">{languageState.current === "ID" ? "Saran Pemeliharaan" : "Maintenance Notice"}:</span> <br/>
                    {languageState.current === "ID" 
                        ? "Lapangan Beta (Outdoor) akan ditutup sementara untuk perbaikan karpet pada hari Selasa depan jam 06:00 - 12:00." 
                        : "Beta Court (Outdoor) will be temporarily closed for carpet maintenance next Tuesday from 06:00 to 12:00."}
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-6">
        <div class="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 class="text-slate-900 text-lg font-semibold">
                {languageState.current === "ID" ? "Penyewaan Terbaru" : "Recent Bookings"}
            </h3>
            <a href="/admin/bookings" class="text-xs text-[#2B95FF] hover:underline font-semibold">
                {languageState.current === "ID" ? "Lihat Semua" : "View All"} →
            </a>
        </div>

        <div class="overflow-x-auto">
            {#if isLoading}
                <div class="p-2 flex flex-col gap-4">
                    <Skeleton height="35px" />
                    {#each Array(4) as _}
                        <Skeleton height="45px" />
                    {/each}
                </div>
            {:else if bookings.length === 0}
                <div class="text-center py-12 text-slate-400 font-light flex flex-col items-center gap-3" in:fade>
                    <i class="ph-duotone ph-folder-open text-4xl text-slate-300"></i>
                    <span class="text-sm font-semibold">{languageState.current === "ID" ? "Belum ada penyewaan terbaru" : "No recent bookings available"}</span>
                </div>
            {:else}
                <table class="w-full text-left text-sm font-light">
                    <thead>
                        <tr class="border-b border-slate-100 text-slate-400 text-xs tracking-wider uppercase font-semibold">
                            <th class="py-4 px-4">Booking ID</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Pelanggan" : "Customer"}</th>
                            <th class="py-4 px-4">Lapangan</th>
                            <th class="py-4 px-4">{languageState.current === "ID" ? "Tanggal & Waktu" : "Date & Time"}</th>
                            <th class="py-4 px-4">Total</th>
                            <th class="py-4 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-600">
                        {#each bookings as booking}
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="py-4 px-4 font-mono font-bold text-slate-900">{booking.id}</td>
                                <td class="py-4 px-4 text-slate-900 font-semibold">{booking.name}</td>
                                <td class="py-4 px-4 text-slate-500">{booking.court}</td>
                                <td class="py-4 px-4 text-slate-500">
                                    {booking.date} &bull; <span class="text-xs">{booking.time}</span>
                                </td>
                                <td class="py-4 px-4 text-slate-900 font-bold">
                                    Rp {booking.amount.toLocaleString("id-ID")}
                                </td>
                                <td class="py-4 px-4">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold inline-block {booking.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : booking.status === 'Pending' ? 'bg-[#FFA800]/10 border border-[#FFA800]/20 text-[#FFA800]' : 'bg-rose-50 text-rose-700'}">
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>

</div>

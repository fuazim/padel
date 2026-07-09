<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";
    import CustomDropdown from "$lib/components/CustomDropdown.svelte";

    let { data } = $props();

    const typeOptions = [
        { value: "Indoor", label: "Indoor" },
        { value: "Outdoor", label: "Outdoor" },
        { value: "Indoor/Pro", label: "Indoor/Pro" },
        { value: "Outdoor/Pro", label: "Outdoor/Pro" }
    ];

    const statusOptions = [
        { value: "Available", label: "Available" },
        { value: "Maintenance", label: "Maintenance" }
    ];

    interface Court {
        id: string;
        name: string;
        type: string;
        desc: string;
        descEN: string;
        price: number;
        image: string;
        status?: string;
    }

    const defaultCourts: Court[] = [
        {
            id: "court-1",
            name: "Court Alpha (Indoor)",
            type: "Indoor",
            desc: "Lapangan indoor ber-AC dengan karpet khusus World Padel Tour, minim terpaan angin dan pencahayaan optimal.",
            descEN: "Air-conditioned indoor court with World Padel Tour carpet, minimal wind disturbance and optimal lighting.",
            price: 180000,
            image: "/images/images/lesson-card.webp"
        },
        {
            id: "court-2",
            name: "Court Beta (Outdoor)",
            type: "Outdoor",
            desc: "Lapangan outdoor premium dengan sirkulasi udara alami yang segar. Nikmati sensasi bermain padel di bawah langit terbuka.",
            descEN: "Premium outdoor court with fresh natural air. Enjoy the sensation of playing padel under the open sky.",
            price: 130000,
            image: "/images/images/practice-card.webp"
        },
        {
            id: "court-3",
            name: "Court Arena (Championship)",
            type: "Indoor/Pro",
            desc: "Lapangan utama untuk turnamen, dilengkapi tribun penonton mini, sistem video-replay, dan pencahayaan profesional.",
            descEN: "Main tournament court equipped with a mini spectator stand, video-replay system, and professional lighting.",
            price: 220000,
            image: "/images/images/hero-image.webp"
        }
    ];

    let courts = $state<Court[]>([]);
    let isEditing = $state(false);
    let editingId = $state("");
    
    // Form fields
    let formName = $state("");
    let formType = $state("Indoor");
    let formPrice = $state(150000);
    let formDesc = $state("");
    let formDescEN = $state("");
    let formImage = $state("/images/images/lesson-card.webp");
    let formStatus = $state("Available");
    let displayPrice = $state("");

    function formatCurrencyString(val: string | number): string {
        if (val === undefined || val === null || val === "") return "";
        const numString = String(val).replace(/\D/g, "");
        if (!numString) return "";
        return Number(numString).toLocaleString("id-ID");
    }

    function handlePriceInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const raw = target.value.replace(/\D/g, "");
        displayPrice = formatCurrencyString(raw);
        formPrice = Number(raw) || 0;
    }

    onMount(() => {
        loadCourts();
    });

    function loadCourts() {
        if (data && data.dbSuccess && data.courts) {
            courts = data.courts;
        } else {
            try {
                const saved = localStorage.getItem("custom_courts");
                if (saved) {
                    courts = JSON.parse(saved);
                } else {
                    courts = [...defaultCourts];
                    saveCourts(courts);
                }
            } catch (_) {
                courts = [...defaultCourts];
            }
        }
    }

    function saveCourts(updatedList: Court[]) {
        try {
            localStorage.setItem("custom_courts", JSON.stringify(updatedList));
        } catch (_) {}
    }

    function openAddForm() {
        isEditing = true;
        editingId = "";
        formName = "";
        formType = "Indoor";
        formPrice = 150000;
        displayPrice = formatCurrencyString(150000);
        formDesc = "";
        formDescEN = "";
        formImage = "/images/images/lesson-card.webp";
        formStatus = "Available";
    }

    function openEditForm(court: Court) {
        isEditing = true;
        editingId = court.id;
        formName = court.name;
        formType = court.type;
        formPrice = court.price;
        displayPrice = formatCurrencyString(court.price);
        formDesc = court.desc;
        formDescEN = court.descEN;
        formImage = court.image;
        formStatus = court.status || "Available";
    }

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (!formName || !formPrice) return;

        let courtId = editingId;
        const isEditingMode = !!editingId;

        if (editingId) {
            // Edit existing
            courts = courts.map(c => c.id === editingId ? {
                id: c.id,
                name: formName,
                type: formType,
                price: Number(formPrice),
                desc: formDesc || formName,
                descEN: formDescEN || formName,
                image: formImage,
                status: formStatus
            } : c);
        } else {
            // Add new
            courtId = "court-" + Date.now();
            const newCourt: Court = {
                id: courtId,
                name: formName,
                type: formType,
                price: Number(formPrice),
                desc: formDesc || formName,
                descEN: formDescEN || formName,
                image: formImage,
                status: formStatus
            };
            courts = [...courts, newCourt];
        }

        saveCourts(courts);

        // Sync to Neon Database
        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('id', courtId);
            formData.append('name', formName);
            formData.append('type', formType);
            formData.append('price', formPrice.toString());
            formData.append('desc', formDesc || formName);
            formData.append('descEN', formDescEN || formName);
            formData.append('image', formImage);

            fetch(isEditingMode ? '?/updateCourt' : '?/addCourt', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Database sync failed:", err));
        }

        isEditing = false;
    }

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this court?")) {
            courts = courts.filter(c => c.id !== id);
            saveCourts(courts);

            // Sync to Neon Database
            if (data && data.dbSuccess) {
                const formData = new FormData();
                formData.append('id', id);
                fetch('?/deleteCourt', {
                    method: 'POST',
                    body: formData
                }).catch(err => console.error("Database sync failed:", err));
            }
        }
    }

    function handleReset() {
        if (confirm("Reset to default courts? This will overwrite your changes.")) {
            courts = [...defaultCourts];
            saveCourts(courts);
        }
    }
</script>

<div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 class="text-slate-900 text-2xl font-bold tracking-tight">
                {languageState.current === "ID" ? "Kelola Lapangan" : "Manage Courts"}
            </h1>
            <p class="text-sm font-light text-slate-400 mt-1">
                {languageState.current === "ID" 
                    ? "Tambah, edit, dan hapus lapangan yang terhubung ke formulir pemesanan."
                    : "Add, edit, and delete courts connected to the customer booking form."}
            </p>
        </div>
        <div class="flex items-center gap-3">
            <button
                onclick={handleReset}
                class="px-4 py-2 border border-slate-200 hover:border-slate-350 text-slate-700 text-sm font-semibold rounded-full cursor-pointer transition-colors bg-white"
            >
                {languageState.current === "ID" ? "Reset Default" : "Reset Default"}
            </button>
            <button
                onclick={openAddForm}
                class="bg-[#2B95FF] hover:bg-[#1a85f0] text-white text-sm font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-2"
            >
                <i class="ph-duotone ph-plus-circle text-lg"></i>
                <span>{languageState.current === "ID" ? "Tambah Lapangan" : "Add Court"}</span>
            </button>
        </div>
    </div>

    <!-- Courts list card -->
    <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-slate-900 font-semibold text-lg">
                {languageState.current === "ID" ? "Daftar Lapangan Aktif" : "Active Courts List"}
            </h3>
            <span class="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-500 font-medium font-mono">
                {courts.length} {languageState.current === "ID" ? "Lapangan" : "Courts"}
            </span>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
                <thead>
                    <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th class="py-4 px-6 w-20">Image</th>
                        <th class="py-4 px-6">Name</th>
                        <th class="py-4 px-6">Type</th>
                        <th class="py-4 px-6 text-right">Price/Hour</th>
                        <th class="py-4 px-6">Status</th>
                        <th class="py-4 px-6">Description (ID)</th>
                        <th class="py-4 px-6 text-right w-36">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                    {#each courts as court}
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="py-4 px-6">
                                <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                    <img src={court.image} alt={court.name} class="w-full h-full object-cover" />
                                </div>
                            </td>
                            <td class="py-4 px-6 font-semibold text-slate-900">{court.name}</td>
                            <td class="py-4 px-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider {court.type.includes('Indoor') ? 'bg-[#2B95FF]/10 text-[#2B95FF]' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                                    {court.type}
                                </span>
                            </td>
                            <td class="py-4 px-6 text-right font-mono font-semibold text-slate-900">
                                Rp {court.price.toLocaleString("id-ID")}
                            </td>
                            <td class="py-4 px-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider {court.status === 'Maintenance' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                                    {court.status || 'Available'}
                                </span>
                            </td>
                            <td class="py-4 px-6 max-w-xs truncate text-slate-500 font-light" title={court.desc}>
                                {court.desc}
                            </td>
                            <td class="py-4 px-6 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button
                                        onclick={() => openEditForm(court)}
                                        class="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center"
                                        title="Edit"
                                    >
                                        <i class="ph-duotone ph-pencil text-base"></i>
                                    </button>
                                    <button
                                        onclick={() => handleDelete(court.id)}
                                        class="p-2 bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-900 rounded-xl hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center"
                                        title="Delete"
                                    >
                                        <i class="ph-duotone ph-trash text-base"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                    {#if courts.length === 0}
                        <tr>
                            <td colspan="6" class="py-12 text-center text-slate-400 font-light">
                                No courts available. Click "Add Court" to create one.
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Edit/Add Modal overlay (No shadows, borders only) -->
    {#if isEditing}
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" transition:fade={{ duration: 200 }}>
            <div class="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col">
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="text-slate-900 font-bold text-lg">
                        {editingId ? (languageState.current === "ID" ? "Edit Lapangan" : "Edit Court") : (languageState.current === "ID" ? "Tambah Lapangan Baru" : "Add New Court")}
                    </h3>
                    <button onclick={() => isEditing = false} class="text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Close">
                        <i class="ph-duotone ph-x text-2xl"></i>
                    </button>
                </div>

                <!-- Modal Form Body -->
                <form onsubmit={handleSubmit} class="p-6 flex flex-col gap-4">
                    <!-- Court Name -->
                    <div class="flex flex-col gap-1.5">
                        <label for="court-name" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                            Court Name
                        </label>
                        <input
                            type="text"
                            id="court-name"
                            required
                            placeholder="e.g. Court Gamma (Indoor)"
                            bind:value={formName}
                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400"
                        />
                    </div>

                    <!-- Row: Type & Price -->
                    <div class="grid grid-cols-2 gap-4">
                        <CustomDropdown
                            label="Type"
                            options={typeOptions}
                            bind:value={formType}
                        />
                        <div class="flex flex-col gap-1.5">
                            <label for="court-price" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                Price/Hour (Rp)
                            </label>
                            <div class="relative w-full">
                                <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                                    Rp
                                </div>
                                <input
                                    type="text"
                                    id="court-price"
                                    required
                                    placeholder="0"
                                    value={displayPrice}
                                    oninput={handlePriceInput}
                                    class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 pl-12 pr-5 text-sm outline-none transition-all font-mono font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Descriptions -->
                    <div class="flex flex-col gap-1.5">
                        <label for="court-desc" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                            Description (Indonesian)
                        </label>
                        <textarea
                            id="court-desc"
                            rows="2"
                            placeholder="Deskripsi lapangan dalam Bahasa Indonesia..."
                            bind:value={formDesc}
                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400 resize-none"
                        ></textarea>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="court-desc-en" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                            Description (English)
                        </label>
                        <textarea
                            id="court-desc-en"
                            rows="2"
                            placeholder="Description in English..."
                            bind:value={formDescEN}
                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400 resize-none"
                        ></textarea>
                    </div>

                    <!-- Court Status Option -->
                    <CustomDropdown
                        label="Status"
                        options={statusOptions}
                        bind:value={formStatus}
                    />

                    <!-- Image selection -->
                    <div class="flex flex-col gap-1.5">
                        <label for="court-image" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                            Court Photo Presets
                        </label>
                        <div class="grid grid-cols-3 gap-2">
                            {#each [
                                { path: "/images/images/lesson-card.webp", name: "Preset 1" },
                                { path: "/images/images/practice-card.webp", name: "Preset 2" },
                                { path: "/images/images/hero-image.webp", name: "Preset 3" }
                            ] as preset}
                                <button
                                    type="button"
                                    onclick={() => formImage = preset.path}
                                    class="border p-1 rounded-xl transition-all relative overflow-hidden flex flex-col gap-1 items-center {formImage === preset.path ? 'border-[#2B95FF] bg-[#2B95FF]/5' : 'border-slate-200 hover:border-slate-350 bg-white'}"
                                >
                                    <div class="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                                        <img src={preset.path} alt={preset.name} class="w-full h-full object-cover" />
                                    </div>
                                    <span class="text-[10px] font-semibold text-slate-600">{preset.name}</span>
                                    {#if formImage === preset.path}
                                        <div class="absolute top-1.5 right-1.5 bg-[#2B95FF] text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
                                            ✓
                                        </div>
                                    {/if}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Modal Actions -->
                    <div class="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onclick={() => isEditing = false}
                            class="px-5 py-2.5 border border-slate-200 hover:border-slate-350 text-slate-700 text-sm font-semibold rounded-full cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="bg-[#2B95FF] hover:bg-[#1a85f0] text-white text-sm font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>

<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";

    let { data } = $props();

    interface Plan {
        id: string;
        name: string;
        price: string;
        priceEN: string;
        features: string[];
        featuresEN: string[];
        isPopular: boolean;
        badge?: string;
        badgeEN?: string;
    }

    const defaultPlans: Plan[] = [
        {
            id: "pro",
            name: "Pro Membership",
            price: "Rp 1.800.000",
            priceEN: "$120",
            features: [
                "Kelas grup tanpa batas",
                "Prioritas booking lapangan",
                "4 sesi latihan privat",
                "Akses semua turnamen klub",
            ],
            featuresEN: [
                "Unlimited group classes",
                "Priority booking",
                "4 private lessons",
                "All tournament access",
            ],
            isPopular: true,
            badge: "Pilihan Utama",
            badgeEN: "Most Popular Plan",
        },
        {
            id: "elite",
            name: "Elite Plan",
            price: "Rp 3.000.000",
            priceEN: "$200",
            features: [
                "8 kelas grup per bulan",
                "4 jam sewa lapangan gratis",
                "2 sesi latihan privat",
                "Akses turnamen internal klub",
            ],
            featuresEN: [
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
            price: "Rp 1.200.000",
            priceEN: "$80",
            features: [
                "4 kelas grup per bulan",
                "2 jam sewa lapangan gratis",
                "Sudah termasuk pinjaman raket & bola",
            ],
            featuresEN: [
                "4 group classes",
                "2 court hours",
                "Equipment rental included",
            ],
            isPopular: false,
        },
    ];

    let plans = $state<Plan[]>([]);
    let isEditing = $state(false);
    let editingId = $state("");

    // Form fields
    let formName = $state("");
    let formPrice = $state("");
    let formPriceEN = $state("");
    let formFeatures = $state<string[]>([]);
    let formFeaturesEN = $state<string[]>([]);
    let formIsPopular = $state(false);
    let formBadge = $state("");
    let formBadgeEN = $state("");

    function addFeature() {
        formFeatures = [...formFeatures, ""];
    }

    function removeFeature(index: number) {
        formFeatures = formFeatures.filter((_, i) => i !== index);
        if (formFeatures.length === 0) formFeatures = [""];
    }

    function addFeatureEN() {
        formFeaturesEN = [...formFeaturesEN, ""];
    }

    function removeFeatureEN(index: number) {
        formFeaturesEN = formFeaturesEN.filter((_, i) => i !== index);
        if (formFeaturesEN.length === 0) formFeaturesEN = [""];
    }

    onMount(() => {
        loadPlans();
    });

    function loadPlans() {
        if (data && data.dbSuccess && data.plans) {
            plans = data.plans;
        } else {
            try {
                const saved = localStorage.getItem("custom_plans");
                if (saved) {
                    plans = JSON.parse(saved);
                } else {
                    plans = [...defaultPlans];
                    savePlans(plans);
                }
            } catch (_) {
                plans = [...defaultPlans];
            }
        }
    }

    function savePlans(updatedList: Plan[]) {
        try {
            localStorage.setItem("custom_plans", JSON.stringify(updatedList));
        } catch (_) {}
    }

    function openAddForm() {
        isEditing = true;
        editingId = "";
        formName = "";
        formPrice = "";
        formPriceEN = "";
        formFeatures = [""];
        formFeaturesEN = [""];
        formIsPopular = false;
        formBadge = "";
        formBadgeEN = "";
    }

    function openEditForm(plan: Plan) {
        isEditing = true;
        editingId = plan.id;
        formName = plan.name;
        formPrice = plan.price;
        formPriceEN = plan.priceEN;
        formFeatures = plan.features.length > 0 ? [...plan.features] : [""];
        formFeaturesEN = plan.featuresEN.length > 0 ? [...plan.featuresEN] : [""];
        formIsPopular = plan.isPopular;
        formBadge = plan.badge || "";
        formBadgeEN = plan.badgeEN || "";
    }

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (!formName || !formPrice || !formPriceEN) return;

        const parsedFeatures = formFeatures
            .map(f => f.trim())
            .filter(f => f.length > 0);

        const parsedFeaturesEN = formFeaturesEN
            .map(f => f.trim())
            .filter(f => f.length > 0);

        let planId = editingId;
        const isEditingMode = !!editingId;

        if (editingId) {
            // Edit existing
            plans = plans.map(p => p.id === editingId ? {
                id: p.id,
                name: formName,
                price: formPrice,
                priceEN: formPriceEN,
                features: parsedFeatures.length > 0 ? parsedFeatures : p.features,
                featuresEN: parsedFeaturesEN.length > 0 ? parsedFeaturesEN : p.featuresEN,
                isPopular: formIsPopular,
                badge: formBadge || undefined,
                badgeEN: formBadgeEN || undefined
            } : p);
        } else {
            // Add new
            planId = "plan-" + Date.now();
            const newPlan: Plan = {
                id: planId,
                name: formName,
                price: formPrice,
                priceEN: formPriceEN,
                features: parsedFeatures,
                featuresEN: parsedFeaturesEN,
                isPopular: formIsPopular,
                badge: formBadge || undefined,
                badgeEN: formBadgeEN || undefined
            };
            plans = [...plans, newPlan];
        }

        savePlans(plans);

        // Sync to Neon Database
        if (data && data.dbSuccess) {
            const formData = new FormData();
            formData.append('id', planId);
            formData.append('name', formName);
            formData.append('price', formPrice);
            formData.append('priceEN', formPriceEN);
            formData.append('isPopular', formIsPopular ? 'true' : 'false');
            formData.append('badge', formBadge || '');
            formData.append('badgeEN', formBadgeEN || '');
            
            const targetFeatures = parsedFeatures.length > 0 ? parsedFeatures : (plans.find(p => p.id === planId)?.features || []);
            const targetFeaturesEN = parsedFeaturesEN.length > 0 ? parsedFeaturesEN : (plans.find(p => p.id === planId)?.featuresEN || []);
            
            formData.append('features', JSON.stringify(targetFeatures));
            formData.append('featuresEN', JSON.stringify(targetFeaturesEN));

            fetch(isEditingMode ? '?/updatePlan' : '?/addPlan', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Database sync failed:", err));
        }

        isEditing = false;
    }

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this plan?")) {
            plans = plans.filter(p => p.id !== id);
            savePlans(plans);

            // Sync to Neon Database
            if (data && data.dbSuccess) {
                const formData = new FormData();
                formData.append('id', id);
                fetch('?/deletePlan', {
                    method: 'POST',
                    body: formData
                }).catch(err => console.error("Database sync failed:", err));
            }
        }
    }

    function handleReset() {
        if (confirm("Reset to default plans? This will overwrite your changes.")) {
            plans = [...defaultPlans];
            savePlans(plans);
        }
    }
</script>

<div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 class="text-slate-900 text-2xl font-bold tracking-tight">
                {languageState.current === "ID" ? "Kelola Paket Membership" : "Manage Membership Plans"}
            </h1>
            <p class="text-sm font-light text-slate-400 mt-1">
                {languageState.current === "ID" 
                    ? "Kelola paket langganan dan keanggotaan yang terhubung ke beranda utama."
                    : "Manage membership plans connected to the pricing section on the homepage."}
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
                <span>{languageState.current === "ID" ? "Tambah Paket" : "Add Plan"}</span>
            </button>
        </div>
    </div>

    <!-- Plans list card -->
    <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-slate-900 font-semibold text-lg">
                {languageState.current === "ID" ? "Daftar Paket Aktif" : "Active Plans List"}
            </h3>
            <span class="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-500 font-medium font-mono">
                {plans.length} {languageState.current === "ID" ? "Paket" : "Plans"}
            </span>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
                <thead>
                    <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th class="py-4 px-6">Plan Name</th>
                        <th class="py-4 px-6">Price (IDR)</th>
                        <th class="py-4 px-6">Price (USD)</th>
                        <th class="py-4 px-6">Popular?</th>
                        <th class="py-4 px-6">Features count</th>
                        <th class="py-4 px-6 text-right w-36">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                    {#each plans as plan}
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="py-4 px-6 font-semibold text-slate-900">
                                <div class="flex items-center gap-2">
                                    <span>{plan.name}</span>
                                    {#if plan.badge}
                                        <span class="bg-[#2B95FF]/10 text-[#2B95FF] text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                                            {plan.badge}
                                        </span>
                                    {/if}
                                </div>
                            </td>
                            <td class="py-4 px-6 font-medium text-slate-900">{plan.price}</td>
                            <td class="py-4 px-6 text-slate-500">{plan.priceEN}</td>
                            <td class="py-4 px-6">
                                {#if plan.isPopular}
                                    <span class="text-emerald-600 font-semibold flex items-center gap-1">
                                        <i class="ph-duotone ph-check-circle text-base"></i> Yes
                                    </span>
                                {:else}
                                    <span class="text-slate-400">No</span>
                                {/if}
                            </td>
                            <td class="py-4 px-6">
                                <span class="font-mono bg-slate-150 border border-slate-200 px-2 py-0.5 rounded text-xs">
                                    {plan.features.length} items
                                </span>
                            </td>
                            <td class="py-4 px-6 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button
                                        onclick={() => openEditForm(plan)}
                                        class="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center"
                                        title="Edit"
                                    >
                                        <i class="ph-duotone ph-pencil text-base"></i>
                                    </button>
                                    <button
                                        onclick={() => handleDelete(plan.id)}
                                        class="p-2 bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-900 rounded-xl hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center"
                                        title="Delete"
                                    >
                                        <i class="ph-duotone ph-trash text-base"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                    {#if plans.length === 0}
                        <tr>
                            <td colspan="6" class="py-12 text-center text-slate-400 font-light">
                                No plans available. Click "Add Plan" to create one.
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
            <div class="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="text-slate-900 font-bold text-lg">
                        {editingId ? (languageState.current === "ID" ? "Edit Paket" : "Edit Plan") : (languageState.current === "ID" ? "Tambah Paket Baru" : "Add New Plan")}
                    </h3>
                    <button onclick={() => isEditing = false} class="text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Close">
                        <i class="ph-duotone ph-x text-2xl"></i>
                    </button>
                </div>

                <!-- Modal Form Body -->
                <form onsubmit={handleSubmit} class="p-6 flex flex-col gap-4 overflow-y-auto">
                    <!-- Plan Name -->
                    <div class="flex flex-col gap-1.5">
                        <label for="plan-name" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                            Plan Name
                        </label>
                        <input
                            type="text"
                            id="plan-name"
                            required
                            placeholder="e.g. Gold Plan"
                            bind:value={formName}
                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400"
                        />
                    </div>

                    <!-- Row: Prices -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label for="plan-price" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                Price (IDR format)
                            </label>
                            <input
                                type="text"
                                id="plan-price"
                                required
                                placeholder="Rp 1.500.000"
                                bind:value={formPrice}
                                class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all"
                            />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label for="plan-price-en" class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
                                Price (USD format)
                            </label>
                            <input
                                type="text"
                                id="plan-price-en"
                                required
                                placeholder="$100"
                                bind:value={formPriceEN}
                                class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all"
                            />
                        </div>
                    </div>

                    <!-- Popular toggles and badges -->
                    <div class="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                bind:checked={formIsPopular}
                                class="w-4.5 h-4.5 text-[#2B95FF] rounded border-slate-200 focus:ring-[#2B95FF] cursor-pointer"
                            />
                            <span class="text-sm font-semibold text-slate-700">Mark as Popular Plan</span>
                        </label>

                        {#if formIsPopular}
                            <div class="grid grid-cols-2 gap-3 mt-1" transition:slide>
                                <div class="flex flex-col gap-1">
                                    <label for="badge-id" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Badge (ID)</label>
                                    <input
                                        id="badge-id"
                                        type="text"
                                        placeholder="Pilihan Utama"
                                        bind:value={formBadge}
                                        class="w-full bg-white border border-slate-200 text-slate-950 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#2B95FF]"
                                    />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label for="badge-en" class="text-[10px] font-bold text-slate-400 uppercase ml-1">Badge (EN)</label>
                                    <input
                                        id="badge-en"
                                        type="text"
                                        placeholder="Most Popular"
                                        bind:value={formBadgeEN}
                                        class="w-full bg-white border border-slate-200 text-slate-950 rounded-xl py-2 px-3 text-xs outline-none focus:border-[#2B95FF]"
                                    />
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Features ID and EN -->
                    <div class="flex flex-col gap-2.5">
                        <div class="flex justify-between items-center ml-1">
                            <span class="text-xs font-bold text-slate-400 tracking-wider uppercase">
                                Features (ID)
                            </span>
                            <button
                                type="button"
                                onclick={addFeature}
                                class="text-xs font-semibold text-[#2B95FF] hover:text-[#1a85f0] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <i class="ph-bold ph-plus"></i> Tambah Fitur
                            </button>
                        </div>
                        <div class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                            {#each formFeatures as _, i}
                                <div class="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Contoh: Akses lapangan 24/7"
                                        bind:value={formFeatures[i]}
                                        class="flex-grow bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-xl py-2.5 px-4 text-sm outline-none transition-all placeholder-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onclick={() => removeFeature(i)}
                                        class="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                        title="Hapus"
                                    >
                                        <i class="ph-bold ph-trash text-base"></i>
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex flex-col gap-2.5">
                        <div class="flex justify-between items-center ml-1">
                            <span class="text-xs font-bold text-slate-400 tracking-wider uppercase">
                                Features (EN)
                            </span>
                            <button
                                type="button"
                                onclick={addFeatureEN}
                                class="text-xs font-semibold text-[#2B95FF] hover:text-[#1a85f0] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <i class="ph-bold ph-plus"></i> Add Feature
                            </button>
                        </div>
                        <div class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                            {#each formFeaturesEN as _, i}
                                <div class="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Example: 24/7 court access"
                                        bind:value={formFeaturesEN[i]}
                                        class="flex-grow bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-xl py-2.5 px-4 text-sm outline-none transition-all placeholder-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onclick={() => removeFeatureEN(i)}
                                        class="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                        title="Delete"
                                    >
                                        <i class="ph-bold ph-trash text-base"></i>
                                    </button>
                                </div>
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

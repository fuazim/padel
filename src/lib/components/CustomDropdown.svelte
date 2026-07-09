<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    interface Option {
        value: string;
        label: string;
    }

    interface Props {
        options: Option[];
        value: string;
        label?: string;
        placeholder?: string;
        onChange?: (val: string) => void;
    }

    let {
        options = [],
        value = $bindable(),
        label = "",
        placeholder = "Select option",
        onChange
    }: Props = $props();

    let isOpen = $state(false);
    let dropdownRef = $state<HTMLDivElement | null>(null);

    const selectedLabel = $derived(
        options.find(opt => opt.value === value)?.label || placeholder
    );

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function selectOption(val: string) {
        value = val;
        isOpen = false;
        if (onChange) onChange(val);
    }

    onMount(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
                isOpen = false;
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<div class="flex flex-col gap-1.5 w-full relative" bind:this={dropdownRef}>
    {#if label}
        <span class="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">
            {label}
        </span>
    {/if}
    
    <button
        type="button"
        onclick={toggleDropdown}
        class="w-full bg-slate-50 border border-slate-200 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all flex items-center justify-between hover:border-slate-350 cursor-pointer"
    >
        <span>{selectedLabel}</span>
        <i class="ph-duotone ph-caret-down text-slate-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"></i>
    </button>

    {#if isOpen}
        <div 
            class="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl z-50 overflow-hidden flex flex-col"
            transition:fade={{ duration: 100 }}
        >
            {#each options as opt}
                <button
                    type="button"
                    onclick={() => selectOption(opt.value)}
                    class="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between {value === opt.value ? 'text-[#2B95FF] bg-[#2B95FF]/5 font-semibold' : 'text-slate-700'}"
                >
                    <span>{opt.label}</span>
                    {#if value === opt.value}
                        <i class="ph-duotone ph-check text-base"></i>
                    {/if}
                </button>
            {/each}
        </div>
    {/if}
</div>

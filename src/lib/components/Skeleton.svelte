<script lang="ts">
    interface Props {
        width?: string;
        height?: string;
        circle?: boolean;
        count?: number;
    }

    let { 
        width = "100%", 
        height = "20px", 
        circle = false, 
        count = 1 
    }: Props = $props();
</script>

<div class="flex flex-col gap-2 w-full">
    {#each Array(count) as _}
        <div 
            class="bg-slate-200/80 animate-pulse {circle ? 'rounded-full' : 'rounded-xl'}" 
            style="width: {width}; height: {height};"
        ></div>
    {/each}
</div>

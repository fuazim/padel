<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let isVisible = false;
    let scrollY = 0;

    // Show button when scrolled down 400px
    function handleScroll() {
        scrollY = window.scrollY;
        isVisible = scrollY > 400;
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Check initial scroll position

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

{#if isVisible}
    <button
        onclick={scrollToTop}
        class="scroll-to-top"
        aria-label="Scroll to top"
        transition:scale={{ duration: 300, easing: cubicOut, start: 0.5 }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-5 h-5"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
        </svg>
    </button>
{/if}

<style>
    .scroll-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 50;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #2b95ff 0%, #0077e6 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow:
            0 4px 15px rgba(43, 149, 255, 0.4),
            0 2px 6px rgba(0, 0, 0, 0.1);
        transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.3s ease;
    }

    .scroll-to-top:hover {
        transform: translateY(-4px);
        box-shadow:
            0 8px 25px rgba(43, 149, 255, 0.5),
            0 4px 10px rgba(0, 0, 0, 0.15);
        background: linear-gradient(135deg, #3da0ff 0%, #0088ff 100%);
    }

    .scroll-to-top:active {
        transform: translateY(-2px);
    }

    /* Mobile positioning */
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 2.75rem;
            height: 2.75rem;
        }
    }
</style>

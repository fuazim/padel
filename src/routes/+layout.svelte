<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { onMount } from "svelte";
    import { auth } from "$lib/auth";
    import { authState } from "$lib/state.svelte";

    let { children } = $props();

    onMount(async () => {
        try {
            // Check session and parse query verifier token automatically
            const session = await auth.getSession();
            if (session?.data?.session) {
                const user = session.data.user;
                authState.user = {
                    name: user.name || user.email.split("@")[0],
                    email: user.email,
                    image: user.image || null,
                    avatar: (user.name || user.email).substring(0, 2).toUpperCase()
                };

                // Clear query parameter and redirect to profile after successful social login
                const params = new URLSearchParams(window.location.search);
                if (params.has("neon_auth_session_verifier")) {
                    window.location.href = "/profile";
                }
            } else {
                authState.user = null;
            }
        } catch (err) {
            console.error("Auth session retrieval failed:", err);
            authState.user = null;
        } finally {
            authState.checked = true;
        }
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

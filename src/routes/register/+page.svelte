<script lang="ts">
    import { fade } from "svelte/transition";
    import { languageState } from "$lib/state.svelte";
    import { auth } from "$lib/auth";

    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let password = $state("");
    let loading = $state(false);
    let errorMessage = $state("");
    let showPassword = $state(false);

    async function handleRegister(e: SubmitEvent) {
        e.preventDefault();
        errorMessage = "";
        
        const isID = languageState.current === "ID";

        if (!name || !email || !phone || !password) {
            errorMessage = isID 
                ? "Semua kolom wajib diisi" 
                : "All fields are required";
            return;
        }

        if (password.length < 6) {
            errorMessage = isID 
                ? "Password minimal harus 6 karakter" 
                : "Password must be at least 6 characters";
            return;
        }

        loading = true;

        try {
            const { data, error } = await auth.signUp.email({
                email,
                password,
                name
            });

            if (error) {
                errorMessage = error.message || (isID ? "Pendaftaran gagal" : "Registration failed");
                loading = false;
                return;
            }

            // Sync user details to Neon DB members table via our profile endpoint action
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            fetch('/profile?/updateProfile', {
                method: 'POST',
                body: formData
            }).catch(err => console.error("Database user sync failed:", err));

            window.location.href = "/login";
        } catch (err: any) {
            console.error("Neon Auth signup error:", err);
            errorMessage = isID 
                ? "Pendaftaran gagal. Silakan coba lagi nanti." 
                : "Registration failed. Please try again later.";
            loading = false;
        }
    }
</script>

<div class="relative min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 text-slate-600">
    <!-- Background blurred light blobs (subtle & premium) -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2B95FF]/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFA800]/3 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="relative w-full max-w-md z-10" in:fade={{ duration: 400 }}>
        <!-- Card Container -->
        <div class="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col gap-6">
            
            <!-- Logo & Greeting -->
            <div class="text-center flex flex-col items-center gap-2">
                <a href="/">
                    <img src="/images/logos/padel-light.svg" alt="Padel Logo" class="h-8 w-auto mb-2" />
                </a>
                <h1 class="text-slate-900 text-2xl sm:text-3xl font-semibold tracking-tight">
                    {languageState.current === "ID" ? "Daftar Akun" : "Create Account"}
                </h1>
                <p class="text-xs sm:text-sm font-light text-slate-500">
                    {languageState.current === "ID" 
                        ? "Bergabunglah untuk sewa lapangan dengan cepat" 
                        : "Join us to book courts quickly"}
                </p>
            </div>

            <!-- Error message banner -->
            {#if errorMessage}
                <div class="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-center">
                    {errorMessage}
                </div>
            {/if}

            <!-- Form -->
            <form onsubmit={handleRegister} class="flex flex-col gap-4">
                <!-- Full Name Input -->
                <div class="flex flex-col gap-1.5">
                    <label for="name" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1">
                        {languageState.current === "ID" ? "Nama Lengkap" : "Full Name"}
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        bind:value={name}
                        class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400"
                    />
                </div>

                <!-- Email Input -->
                <div class="flex flex-col gap-1.5">
                    <label for="email" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="yourname@example.com"
                        bind:value={email}
                        class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400"
                    />
                </div>

                <!-- Phone Input -->
                <div class="flex flex-col gap-1.5">
                    <label for="phone" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1">
                        {languageState.current === "ID" ? "Nomor Telepon" : "Phone Number"}
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        placeholder="0812XXXXXXXX"
                        bind:value={phone}
                        class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 text-sm outline-none transition-all placeholder-slate-400"
                    />
                </div>

                <!-- Password Input -->
                <div class="flex flex-col gap-1.5">
                    <label for="password" class="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1">
                        Password
                    </label>
                    <div class="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            bind:value={password}
                            class="w-full bg-slate-50 border border-slate-200 focus:border-[#2B95FF] focus:ring-2 focus:ring-[#2B95FF]/10 text-slate-950 rounded-2xl py-3 px-5 pr-12 text-sm outline-none transition-all placeholder-slate-400"
                        />
                        <button
                            type="button"
                            onclick={() => showPassword = !showPassword}
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer focus:outline-none"
                            aria-label="Toggle password visibility"
                        >
                            <i class="ph-duotone ph-{showPassword ? 'eye-slash' : 'eye'} text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    disabled={loading}
                    class="w-full bg-[#2B95FF] hover:bg-[#1a85f0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3.5 rounded-full transition-all text-sm cursor-pointer flex items-center justify-center gap-3 mt-2"
                >
                    {#if loading}
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {languageState.current === "ID" ? "Memproses..." : "Processing..."}
                    {:else}
                        {languageState.current === "ID" ? "Daftar Sekarang" : "Register Now"}
                    {/if}
                </button>
            </form>

            <!-- Footer links -->
            <div class="text-center text-sm font-light text-slate-500">
                {languageState.current === "ID" ? "Sudah punya akun?" : "Already have an account?"}
                <a href="/login" class="text-[#2B95FF] font-semibold hover:underline ml-1">
                    {languageState.current === "ID" ? "Masuk Di Sini" : "Login Here"}
                </a>
            </div>

        </div>
    </div>
</div>

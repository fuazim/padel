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

    async function handleGoogleSignup() {
        try {
            await auth.signIn.social({
                provider: "google",
                callbackURL: window.location.origin + "/profile"
            });
        } catch (err) {
            console.error("Google Signup failed:", err);
            window.location.href = "/profile";
        }
    }

    async function handleAppleSignup() {
        try {
            await auth.signIn.social({
                provider: "apple",
                callbackURL: window.location.origin + "/profile"
            });
        } catch (err) {
            console.error("Apple Signup failed:", err);
            window.location.href = "/profile";
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

            <!-- Divider -->
            <div class="relative flex items-center justify-center my-1">
                <div class="border-t border-slate-200 w-full"></div>
                <span class="absolute bg-white px-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    {languageState.current === "ID" ? "Atau daftar dengan" : "Or continue with"}
                </span>
            </div>

            <!-- Social Logins -->
            <div class="flex flex-col gap-4">
                <button 
                    onclick={handleGoogleSignup}
                    class="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-3 px-4 flex items-center justify-center gap-2.5 text-sm font-medium text-slate-800 transition-all cursor-pointer"
                >
                    <!-- Google SVG -->
                    <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>{languageState.current === "ID" ? "Daftar dengan Google" : "Sign Up with Google"}</span>
                </button>
            </div>

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

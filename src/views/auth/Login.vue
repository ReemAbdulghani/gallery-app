<template>
  <div class="min-h-screen bg-light/30 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full mx-auto">
      
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-card border border-slate-100 mb-4">
          <span class="text-3xl">📸</span>
        </div>
        <h2 class="font-heading text-3xl font-extrabold text-dark tracking-tight">Welcome Back</h2>
        <p class="text-secondary mt-2 text-sm">Access your creative studio and galleries</p>
      </div>

      <div class="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
        <div class="p-8 space-y-6">
          <ErrorMsg :error="error"/>
          <div class="group">
            <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 group-focus-within:text-primary transition-colors">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="name@example.com"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-dark"
            />
          </div>

          <div class="group">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">
                Password
              </label>
              <a href="#" class="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot?</a>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-dark"
            />
          </div>

          <button
            @click="submit"
            class="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
          <span>Sign In to Studio</span>
          <span v-if="loading" class="mr-2">
            <LoadingSpinner />
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          </button>
        </div>

        <div class="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
          <p class="text-sm text-secondary font-medium">
            New to the gallery? 
            <router-link to="/signup" class="text-primary font-bold hover:underline ml-1">Create an account</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";

const router = useRouter();
const { login, error, loading } = useAuth();

const email = ref("");
const password = ref("");

async function submit() {
  await login(email.value, password.value);

  if (!error.value) {
    router.push("/dashboard"); 
  }
}
</script>
<template>
  <div class="min-h-screen bg-light/30 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full mx-auto">
      
      <div class="text-center mb-8">
        <h2 class="font-heading text-3xl font-extrabold text-primary tracking-tight">Join Gallo</h2>
        <p class="text-secondary mt-2 text-sm">Start sharing your memories in minutes</p>
      </div>

      <div class="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
        <div class="p-8 space-y-5">
          <div v-if="error" class="mt-4 text-red-600 text-center font-semibold">
          {{ error }}
        </div>
          <div class="group">
            <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 group-focus-within:text-primary transition-colors">
              Full Name
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="John Doe"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-dark"
            />
          </div>

          <div class="group">
            <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 group-focus-within:text-primary transition-colors">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="name@example.com"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-dark"
            />
          </div>

          <div class="group">
            <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 group-focus-within:text-primary transition-colors">
              Choose Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Minimum 8 characters"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-dark"
            />
          </div>

          <div class="flex items-start gap-4 p-4 bg-light/50 rounded-2xl border border-slate-100">
            <label class="relative inline-flex items-center cursor-pointer mt-1">
              <input type="checkbox" v-model="agreed" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <div>
              <p class="text-xs font-bold text-dark leading-tight">I agree to the Terms of Service</p>
              <p class="text-[10px] text-secondary mt-1 uppercase tracking-widest">Digital Asset Agreement</p>
            </div>
          </div>

          <button
            @click="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all transform active:scale-[0.98] flex items-center justify-center"
          >
            <span v-if="loading" class="mr-2">
                <LoadingSpinner />
            </span>
            <span>Create My Studio</span>
          </button>
        </div>

        <div class="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
          <p class="text-sm text-secondary font-medium">
            Already have an account? 
            <router-link to="/login" class="text-primary font-bold hover:underline ml-1">Sign in here</router-link>
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

const router = useRouter();
const { signup, error, loading } = useAuth();

const email = ref("");
const password = ref("");
const name = ref("");
const agreed = ref(false);

async function submit() {
  await signup(email.value, password.value, name.value);

  if (!error.value) {
    router.push("/dashboard");
  }
}
</script>
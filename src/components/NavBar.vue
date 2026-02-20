<template>
  <nav class="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
          <span class="text-white text-xl">📸</span>
        </div>
        <div>
          <span class="block font-heading text-lg font-bold text-dark leading-tight tracking-tight">Gallo</span>
          <span class="block text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Home of Photographers</span>
        </div>
      </router-link>

      <div class="hidden md:flex items-center gap-8">
        <router-link to="/" class="text-sm font-bold text-secondary hover:text-primary transition-colors">Explore</router-link>
        <router-link v-if="user" to="/dashboard" class="text-sm font-bold text-secondary hover:text-primary transition-colors">My Albums</router-link>
        
        <div class="h-4 w-[1px] bg-slate-200 mx-2"></div>

        <template v-if="user">
          <router-link 
            to="/albums/new" 
            class="text-sm font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span class="text-lg">+</span> Create Album
          </router-link>
          
          <div class="relative pl-4">
            <button 
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center gap-2 p-1 rounded-full hover:bg-light transition-colors focus:outline-none"
            >
              <div class="w-9 h-9 rounded-full bg-light border border-slate-200 flex items-center justify-center overflow-hidden">
                <img v-if="user.photoURL" :src="user.photoURL" class="w-full h-full object-cover" />
                <span v-else class="text-xs font-bold text-secondary">{{ user.email?.charAt(0).toUpperCase() }}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" :class="{'rotate-180': isDropdownOpen}" class="h-4 w-4 text-secondary transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 z-[110]">
                <div class="px-4 py-2 border-b border-slate-50">
                  <p class="text-[10px] font-black text-secondary uppercase tracking-widest leading-tight">Account</p>
                  <p class="text-xs font-bold text-dark truncate">{{ user.email }}</p>
                </div>
                
                <button 
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            </transition>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="text-sm font-bold text-dark hover:text-primary transition-colors">Sign In</router-link>
          <router-link 
            to="/signup" 
            class="px-5 py-2.5 bg-dark text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all transform active:scale-95"
          >
            Get Started
          </router-link>
        </template>
      </div>

      <button @click="isOpen = !isOpen" class="md:hidden p-2 text-dark focus:outline-none">
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-[105] bg-transparent"></div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isOpen" class="md:hidden bg-white border-b border-slate-100 absolute w-full shadow-xl">
        <div class="px-6 py-6 space-y-4">
          <router-link @click="isOpen = false" to="/" class="block text-base font-bold text-secondary hover:text-primary">Explore</router-link>
          
          <template v-if="user">
            <router-link @click="isOpen = false" to="/dashboard" class="block text-base font-bold text-secondary hover:text-primary">My Albums</router-link>
            <router-link @click="isOpen = false" to="/albums/new" class="block text-base font-bold text-primary">+ Create Album</router-link>
            <hr class="border-slate-100" />
            <div class="flex items-center justify-between">
               <span class="text-sm font-bold text-dark truncate mr-4">{{ user.email }}</span>
               <button @click="handleLogout" class="text-sm font-bold text-red-500">Logout</button>
            </div>
          </template>

          <template v-else>
            <router-link @click="isOpen = false" to="/login" class="block text-base font-bold text-dark">Sign In</router-link>
            <router-link @click="isOpen = false" to="/signup" class="block w-full text-center px-5 py-3 bg-dark text-white font-bold rounded-xl">Get Started</router-link>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";

const { user, logout } = useAuth();
const isOpen = ref(false); // Mobile menu
const isDropdownOpen = ref(false); // Desktop dropdown

const handleLogout = () => {
  isOpen.value = false;
  isDropdownOpen.value = false;
  logout();
};
</script>
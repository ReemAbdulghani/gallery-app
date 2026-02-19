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
          
          <div class="flex items-center gap-3 pl-4">
            <div class="text-right hidden lg:block">
              <p class="text-[10px] font-black text-secondary uppercase tracking-widest">Creator</p>
              <p class="text-xs font-bold text-dark">{{ user.email?.split('@')[0] }}</p>
            </div>
            <button 
              @click="logout"
              class="w-10 h-10 rounded-full bg-light border border-slate-200 flex items-center justify-center hover:border-primary/30 transition-all overflow-hidden"
            >
              <img v-if="user.photoURL" :src="user.photoURL" class="w-full h-full object-cover" />
              <span v-else class="text-xs font-bold text-secondary">US</span>
            </button>
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

      <button class="md:hidden p-2 text-dark">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";

const { user, logout } = useAuth();
</script>
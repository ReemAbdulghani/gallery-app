<template>
  <div class="min-h-screen bg-white">
    <nav class="border-b border-slate-100 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Albums
        </router-link>
        <router-link 
            v-if="user && album && user.uid === album.ownerId"
            :to="`/albums/${albumId}/edit`"
            class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest text-secondary hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Studio
          </router-link>
      </div>
    </nav>

    <header class="py-12 px-6 bg-light/50 border-b border-slate-100 rounded-2xl mt-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-2">
            <span class="text-primary font-bold text-xs uppercase tracking-widest">{{ album?.isPublic ? 'Public' : 'Private' }} Collection</span>
            <h1 class="font-heading text-4xl md:text-5xl font-extrabold text-dark tracking-tight">
              {{ album?.title }}
            </h1>
            <p class="text-secondary max-w-2xl font-thin leading-relaxed">
              {{ album?.description }}
            </p>
          </div>
          
          <div class="flex items-center gap-6 border-l border-slate-200 pl-6 h-fit hidden md:flex">
            <div class="text-center">
              <p class="text-xs font-bold text-secondary uppercase tracking-tighter">Photos</p>
              <p class="text-2xl font-black text-dark">{{ album?.photos?.length || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-12 bg-light/50 mt-7 rounded-2xl">
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="aspect-square bg-slate-100 animate-pulse rounded-card"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <div 
          v-for="(photo, i) in album?.photos" 
          :key="i"
          class="group cursor-pointer"
        >
          <div 
            class="relative aspect-square rounded-card bg-white 
                   shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100
                   transition-all duration-500 ease-out
                   hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-3 hover:ring-8 hover:ring-primary/5"
          >
            <div class="w-full h-full overflow-hidden rounded-card">
              <img 
                :src="photo.url" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            
            <div 
              @click="openLightbox(photo)"
              class="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-card"
            >
              <div class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary shadow-2xl transform scale-50 group-hover:scale-100 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-between items-center px-1">
            <p class="text-[11px] font-bold text-secondary/60 uppercase tracking-[0.2em]">Capture 0{{ i + 1 }}</p>
            <span class="w-1 h-1 rounded-full bg-primary"></span>
          </div>
        </div>
      </div>
    </main>

    <Transition name="fade">
      <div 
        v-if="selectedPhoto" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      >
        <div @click="closeLightbox" class="absolute inset-0 bg-dark/90 backdrop-blur-xl"></div>
        
        <div class="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
          <button 
            @click="closeLightbox"
            class="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
          >
            Close ✕
          </button>
          
          <img 
            :src="selectedPhoto.url" 
            class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
          />
          
          <p class="mt-6 text-white font-heading text-xl font-bold tracking-tight">
            {{ album?.title }} — 0{{ album.photos.indexOf(selectedPhoto) + 1 }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAlbums } from '@/composables/useAlbums';
import { useAuth } from "@/composables/useAuth"; // Import your auth logic

const { user } = useAuth();
const route = useRoute();
const albumId = route.params.id;
const album = ref(null);
const selectedPhoto = ref(null); // The state for the enlarged image

const { getAlbum, loading, error } = useAlbums();

const openLightbox = (photo) => {
  selectedPhoto.value = photo;
  document.body.style.overflow = 'hidden'; // Stop scrolling when open
};

const closeLightbox = () => {
  selectedPhoto.value = null;
  document.body.style.overflow = 'auto'; // Re-enable scrolling
};

onMounted(async () => {
  try {
    album.value = await getAlbum(albumId);
  } catch (err) {
    album.value = null;
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
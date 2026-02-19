<template>
  <div class="min-h-screen bg-light/50 px-6 py-12">
    <div class="max-w-6xl mx-auto">
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="font-heading text-4xl font-bold text-dark tracking-tight">
            {{ titlePrefix }} <span class="text-primary">Albums</span>
          </h1>
          <p class="text-secondary mt-2 text-lg">{{ subTitle }}</p>
        </div>
        <div class="h-1 w-20 bg-primary rounded-full hidden md:block mb-3"></div>
      </header>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p class="mt-4 text-secondary font-medium">Fetching galleries...</p>
      </div>

      <div 
        v-if="albums.length === 0 && !loading" 
        class="bg-white rounded-card shadow-card p-12 text-center border border-slate-100"
      >
        <div class="text-5xl mb-4">📸</div>
        <h3 class="text-xl font-bold text-dark">You have no albums yet</h3>
        <p class="text-secondary">Create your first album to share your memories with the world.</p>
        <div class="flex justify-center mt-4">
            <router-link 
                to="/albums/new" 
                class="text-sm font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span class="text-lg">+</span> Create Album
            </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="album in albums"
          :key="album.id"
          class="group relative aspect-[4/5] rounded-card overflow-hidden shadow-card transition-all duration-500 hover:shadow-2xl"
        >
          <img
            v-if="album.photos?.length"
            :src="album.photos[0].url"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div v-else class="absolute inset-0 bg-slate-200 flex items-center justify-center">
            <span class="text-slate-400 italic">Empty</span>
          </div>

          <div class="absolute top-4 right-4 z-10 px-2.5 py-1 bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-full tracking-wider uppercase">
            {{ album.photos?.length || 0 }} photos
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

          <div class="absolute inset-0 flex flex-col justify-end p-5">
            
            <h2 class="font-heading text-xl text-white mb-2 transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {{ album.title }}
            </h2>

            <router-link
              :to="`/albums/${album.id}`"
              class="text-sm font-bold text-primary flex items-center gap-1 group/link"
            >
              View Album 
              <span class="transition-transform group-hover/link:translate-x-1">→</span>
            </router-link>
          </div>

          <div class="absolute inset-0 border border-white/10 pointer-events-none rounded-card"></div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  titlePrefix: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  albums: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>
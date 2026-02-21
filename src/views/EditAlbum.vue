<template>
  <div v-if="ownershipVerified" class="min-h-screen bg-light/30 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <nav class="flex items-center justify-between mb-8">
        <router-link 
          :to="`/albums/${albumId}`" 
          class="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cancel & Exit
        </router-link>
        
      </nav>

      <div v-if="!albumId" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>

      <div v-else class="space-y-8">
        
        <section class="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
          <header class="p-6 border-b border-slate-50 bg-slate-50/30">
            <h1 class="font-heading text-2xl font-bold text-dark">Album Settings</h1>
            <p class="text-secondary text-sm">Update the identity and visibility of your collection.</p>
          </header>

          <div class="p-8 space-y-6">
            <div class="group">
              <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 group-focus-within:text-primary transition-colors">
                Album Title
              </label>
              <input
                v-model="title"
                type="text"
                placeholder="Name your masterpiece..."
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-dark"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2">
                Description
              </label>
              <textarea
                v-model="description"
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none font-medium text-dark"
              ></textarea>
            </div>

            <div class="flex items-center justify-between p-4 bg-light/50 rounded-2xl border border-slate-100">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm">
                  <span v-if="isPublic" class="text-lg">🌍</span>
                  <span v-else class="text-lg">🔒</span>
                </div>
                <div>
                  <p class="font-bold text-dark text-sm">Visibility</p>
                  <p class="text-xs text-secondary">{{ isPublic ? 'Anyone can view this album' : 'Only you can see this' }}</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="isPublic" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-card shadow-card border border-slate-100 overflow-hidden">
          <header class="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div>
              <h2 class="font-heading text-xl font-bold text-dark">Manage Photos</h2>
              <p class="text-secondary text-sm">Organize, remove, or add new memories.</p>
            </div>
            <span class="px-3 py-1 bg-dark text-white text-[10px] font-black rounded-full uppercase">
              {{ existingPhotos.length }} / 5 Slots
            </span>
          </header>

          <div class="p-8">
            <div v-if="existingPhotos.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
              <div 
                v-for="(img, i) in existingPhotos" 
                :key="i" 
                class="group relative aspect-square rounded-xl bg-white p-1.5 shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-100"
              >
                <div class="w-full h-full overflow-hidden rounded-lg">
                  <img :src="img.url" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                <button
                  @click="confirmDelete(img)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full shadow-lg flex items-center justify-center text-xs transition-all hover:scale-110 z-10"
                  title="Remove photo"
                >
                  <LoadingSpinner v-if="deletingPhotoPath === img.path" class="w-4 h-4 text-white"/>
                  <span v-else class="text-white">✕</span>
                </button>
                <Transition name="fade">
                    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div @click="showDeleteModal = false" class="absolute inset-0 bg-light/10 backdrop-blur-sm transition-all"></div>
                        
                        <div class="relative bg-white w-full max-w-sm rounded-card shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div class="p-8 text-center">
                            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            🗑️
                            </div>
                            <h3 class="font-heading text-xl font-bold text-dark mb-2">Remove Photo?</h3>
                            <p class="text-secondary text-sm leading-relaxed">
                            This action cannot be undone. This photo will be permanently deleted from the album.
                            </p>
                        </div>
                        
                        <div class="flex border-t border-slate-100">
                            <button 
                                @click="showDeleteModal = false"
                                class="flex-1 px-6 py-4 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors"
                            >
                            Nevermind
                            </button>
                            <button 
                                @click="removeExisting(); showDeleteModal = false"
                                class="flex-1 px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-l border-slate-100"
                            >
                            Yes, Delete
                            </button>
                        </div>
                        </div>
                    </div>
                </Transition>
              </div>
            </div>

            <div class="bg-light/30 rounded-2xl border-2 border-dashed border-slate-200 p-2">
               <MultiImagesUploader @files-selected="onFilesSelected" :max="5 - existingPhotos.length" />
            </div>
          </div>
        </section>

        <div class="sticky bottom-8 z-20">
          <ErrorMsg :error="serverError" class="mb-4"/>
          <button
            @click="save"
            :disabled="localLoading"
            class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>🚀 Save Changes</span>
            <span v-if="localLoading" class="mr-2">
              <LoadingSpinner />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import MultiImagesUploader from "@/components/MultiImagesUploader.vue";
import { useAlbums } from "@/composables/useAlbums";
import { usePhotos } from "@/composables/usePhotos";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";

const { user } = useAuth();
const router = useRouter();
const route = useRoute();
const albumId = route.params.id;

const { getAlbum, updateAlbum, error: albumError, loading} = useAlbums();
const photos = usePhotos(albumId);

const title = ref("");
const description = ref("");
const isPublic = ref(true);
const existingPhotos = ref([]);
const newFiles = ref([]);
const serverError = ref("");
const ownershipVerified = ref(false);
onMounted(async () => {
  ownershipVerified.value = false;
  const album = await getAlbum(albumId);

  // Ownership check
  if (!album || album.ownerId !== user.value.uid) {
    console.log("User does not own this album");
    router.replace({ name: "not-found" });
  } else {
    ownershipVerified.value = true;
    title.value = album.title;
    description.value = album.description || "";
    isPublic.value = album.isPublic;
    existingPhotos.value = album.photos || [];
  }
});

function onFilesSelected(files) {
  newFiles.value = files;
}

// Delete existing image
const showDeleteModal = ref(false);
const photoToDelete = ref(null);
const deletingPhotoPath = ref(null);
function confirmDelete(photo) {
  showDeleteModal.value = true;
  photoToDelete.value = photo;
}
async function removeExisting() {
  if (!photoToDelete.value) return;
  deletingPhotoPath.value = photoToDelete.value.path;
  await photos.deletePhoto(photoToDelete.value);

  if (photos.error.value) {
    serverError.value = photos.error.value;
  } else {
    existingPhotos.value = existingPhotos.value.filter(p => p.path !== photoToDelete.value.path);
  }
  deletingPhotoPath.value = null;
}

const localLoading = ref(false);
async function save() {
  localLoading.value = true;
  await updateAlbum(albumId, {
    title: title.value,
    description: description.value,
    isPublic: isPublic.value,
  });

  if (albumError.value) {
    serverError.value = albumError.value || "Failed to update album. Please try again.";
    localLoading.value = false;
    return;
  }
  // upload new images
  if (newFiles.value.length) {
    await photos.uploadPhotos(newFiles.value, user.value.uid, isPublic.value);

    if (photos.error.value) {
      serverError.value = 'Album was created but failed to upload some photos: \n' + photos.error.value;
    } else {
      // Update local previews
      existingPhotos.value.push(...photos.uploadedUrls.value);
    }
  }
  localLoading.value = false;
  router.push(`/albums/${albumId}`);
}
</script>

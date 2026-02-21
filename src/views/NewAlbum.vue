<template>
  <div class="min-h-screen bg-light/30 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      
      <router-link to="/" class="text-secondary hover:text-primary text-sm font-bold flex items-center gap-1 mb-6">
        ← Back to Gallery
      </router-link>

      <div class="bg-white rounded-card shadow-card p-8 border border-slate-100">
        <header class="mb-8 text-center">
          <h1 class="font-heading text-3xl font-bold text-primary">Create New Album</h1>
          <p class="text-secondary">Share your latest collection with the world</p>
        </header>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-dark mb-2">Album Title</label>
            <input
              v-model="title"
              type="text"
              placeholder="e.g. Summer Vacation 2026"
              class="w-full px-4 py-3 rounded-lg border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <span class="text-red-500 text-sm">{{ validationErrors.title }}</span>
          </div>

          <div>
            <label class="block text-sm font-bold text-dark mb-2">Description (Optional)</label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="Tell us about these photos..."
              class="w-full px-4 py-3 rounded-lg border border-secondary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-between p-4 bg-light/50 rounded-xl border border-slate-100">
            <div>
              <p class="font-bold text-dark text-sm">Public Album</p>
              <p class="text-xs text-secondary">Anyone with the link can view this.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="isPublic" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-bold text-dark mb-3">Upload Photos</label>
            <MultiImagesUploader @files-selected="onFilesSelected" />
            <span class="text-red-500 text-sm">{{ validationErrors.files }}</span>
          </div>

          <button
            @click="submit"
            :disabled="loading"
            class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
            <span v-if="loading">
              <LoadingSpinner class="mr-2" />
            </span>
            <span> Create My Album 🚀</span>
          </button>
          <ErrorMsg :error="serverError" class="mt-4"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAlbums } from "@/composables/useAlbums";
import { usePhotos } from "@/composables/usePhotos";
import MultiImagesUploader from "@/components/MultiImagesUploader.vue";
import { mapFirebaseError } from "@/firebaseErrors";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";


const { user } = useAuth();
const router = useRouter();

const title = ref("");
const description = ref("");
const isPublic = ref(true);
const selectedFiles = ref([]);
const loading = ref(false);


function onFilesSelected(files) {
  selectedFiles.value = files;
}

const { createAlbum, error: albumError } = useAlbums();


const serverError = ref("");
const validationErrors = ref({});
const validateForm = () => {
  const errors = {};
  if (!title.value.trim()) {
    errors.title = "Album title is required";
  }
  if (selectedFiles.value.length === 0) {
    errors.files = "Please select at least 1 image";
  }
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

async function submit() {
  loading.value = true;
  serverError.value = "";
  
  const isValid = validateForm();
  if (!isValid) {
    loading.value = false;
    return;
  }

  try {
    // Step 1 — create album document
    const albumId = await createAlbum({
      title: title.value,
      description: description.value,
      isPublic: isPublic.value,
      photos: [],
      ownerId: user.value?.uid || null
    });
    if (!albumId) {
      serverError.value = albumError.value || "Failed to create album. Please try again.";
      loading.value = false;
      return;
    }

    // Step 2 — upload photos
    const photos = usePhotos(albumId);
    await photos.uploadPhotos(selectedFiles.value, user.value?.uid, isPublic.value);

    
    if (photos.error.value) {
      serverError.value = 'Album was created but failed to upload some photos: \n' + photos.error.value;
    }
    
    // Reset
    title.value = "";
    description.value = "";
    isPublic.value = true;
    selectedFiles.value = [];
    
    loading.value = false;
    router.push(`/albums/${albumId}`);

  } catch (err) {
    serverError.value = mapFirebaseError(err);
    loading.value = false;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'relative border-2 border-dashed rounded-card p-8 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer',
        isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-secondary/30 bg-light/50 hover:border-primary/50'
      ]"
      @click="$refs.fileInput.click()"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        multiple 
        accept="image/*" 
        @change="handleFiles" 
      />
      
      <div class="text-4xl mb-3">📸</div>
      <p class="text-dark font-bold">Click or drag images here</p>
      <p class="text-secondary text-sm">Up to {{ max }} photos (Max 5MB each)</p>
    </div>

    <TransitionGroup name="fade">
      <div v-for="(err, i) in errors" :key="i" class="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
        <span>⚠️</span> {{ err }}
      </div>
    </TransitionGroup>

    <div v-if="selectedFiles.length" class="grid grid-cols-3 sm:grid-cols-5 gap-3">
      <div v-for="(file, idx) in selectedFiles" :key="idx" class="group relative aspect-square rounded-lg overflow-hidden border border-secondary/20 shadow-sm">
        <img :src="file.preview" class="w-full h-full object-cover" />
        <button 
          @click.stop="removeFile(idx)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({ max: { type: Number, default: 5 } });
const emit = defineEmits(["files-selected"]);

const selectedFiles = ref([]);
const errors = ref([]);
const isDragging = ref(false);

function handleDrop(e) {
  isDragging.value = false;
  processFiles(e.dataTransfer.files);
}

function handleFiles(e) {
  processFiles(e.target.files);
}

function processFiles(rawFiles) {
  errors.value = [];
  const files = Array.from(rawFiles);

  if (selectedFiles.value.length + files.length > props.max) {
    errors.value.push(`Limit exceeded. You can only add 5 images total.`);
    return;
  }

  for (let file of files) {
    if (!file.type.startsWith("image/")) {
      errors.value.push(`${file.name} is not an image.`);
      continue;
    }
    if (file.size > 5 * 1024 * 1024) {
      errors.value.push(`${file.name} is too heavy (>5MB).`);
      continue;
    }
    file.preview = URL.createObjectURL(file);
    selectedFiles.value.push(file);
  }
  emit("files-selected", selectedFiles.value);
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1);
  emit("files-selected", selectedFiles.value);
}
</script>
<template>
<div>
    <Transition name="fade">
        <p v-if="error" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
        <span>⚠️</span> {{ error }}
        </p>
    </Transition>
</div>
</template>
<script setup>
import { defineProps } from "vue";

defineProps({
  error: {
    type: String,
    default: null
  }
});
</script>
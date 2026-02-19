<template>
  <AlbumsListing :albums="albums" :loading="loading" title-prefix="My" sub-title="This is your dashboard to manage your personal collections."/>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAlbums } from "@/composables/useAlbums";
import AlbumsListing from "@/components/AlbumsListing.vue";

const albums = ref([]);

const { getMyAlbums, loading, error } = useAlbums();

onMounted(async () => {
  albums.value = await getMyAlbums();
});
</script>

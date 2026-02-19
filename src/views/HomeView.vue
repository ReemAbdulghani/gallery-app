<template>
  <AlbumsListing :albums="albums" :loading="loading" title-prefix="Public" sub-title="Explore curated collections from our community."/>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAlbums } from "@/composables/useAlbums";
import AlbumsListing from "@/components/AlbumsListing.vue";

const albums = ref([]);

const { getAll, loading, error } = useAlbums();

onMounted(async () => {
  albums.value = await getAll();
});
</script>

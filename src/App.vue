<script setup>
import MenuBar from "./components/MenuBar.vue";
</script>

<template>
  <v-app>
    <div class="app-container">
      <MenuBar :key="$route.fullPath" />
      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<style>
.app-container {
  background-image: url('/background-image.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}
</style>

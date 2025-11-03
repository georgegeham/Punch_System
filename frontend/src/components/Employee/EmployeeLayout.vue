<template>
  <v-app class="d-flex flex-column fill-height">
    <!-- Top Bar -->
    <AppBar :title="$router.currentRoute.name" />

    <!-- Main Content -->
    <v-main class="flex-grow-1">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "../AppBar.vue";

export default {
  name: "EmployeeLayout",
  components: {
    AppBar,
  },
};
</script>

<style scoped>
.v-application {
  height: 100%;
}
</style>

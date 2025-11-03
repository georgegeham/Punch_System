<template>
  <v-app class="d-flex flex-column fill-height">
    <!-- Top Bar -->
    <AppBar :title="$router.currentRoute.name" @invite="dialog = true" />

    <!-- Main Content -->
    <v-main class="flex-grow-1">
      <Dialog :dialog.sync="dialog" />
      <router-view />
    </v-main>

    <!-- Footer -->
    <AppFooter />
  </v-app>
</template>

<script>
import AppBar from "./AppBar.vue";
import AppFooter from "./AppFooter.vue";
import EmployeeEmailDialog from "./ui/Dialog.vue";
export default {
  name: "MyLayout",
  components: {
    AppBar,
    AppFooter,
    Dialog: EmployeeEmailDialog,
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style scoped>
.v-application {
  height: 100%;
}
</style>

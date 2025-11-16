<template>
  <div id="app">
    <v-app>
      <router-view />
      <MySnackbar />
      <FullScreenLoader />
    </v-app>
  </div>
</template>
<script>
import MySnackbar from "./components/ui/Snackbar.vue";
import FullScreenLoader from "./components/ui/Loader.vue";
export default {
  name: "App",
  components: {
    MySnackbar,
    FullScreenLoader,
  },
};
</script>

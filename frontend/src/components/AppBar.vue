<template>
  <v-app-bar :elevation="2" app>
    <v-toolbar-title class="title">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="user?.role === 'hr'" icon @click="$emit('invite')">
      <v-icon>mdi-email-plus</v-icon>
    </v-btn>
    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import User from "@/store/slices/Classes/User";

export default {
  name: "AppBar",
  props: {
    title: {
      type: String,
      default: "Dashboard",
    },
  },

  computed: {
    user() {
      return this.$store.getters.User;
    },
  },
  methods: {
    async logout() {
      try {
        const user = new User();
        const response = await user.logout();
        this.$store.dispatch("resetUser");
        this.$store.commit("showSnackbar", {
          text: response.message || "Logout successful!",
          color: "success",
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.$router.push({ name: "Start" });
      }
    },
  },
};
</script>

<style scoped>
.title {
  display: block !important;
  text-wrap: nowrap !important;
  /* text-overflow: unset !important; */
}
</style>

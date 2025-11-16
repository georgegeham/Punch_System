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
      return this.$store.state.user.user;
    },
  },
  watch: {
    user(newVal) {
      if (newVal) {
        this.$forceUpdate();
      }
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push({ name: "Start" });
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

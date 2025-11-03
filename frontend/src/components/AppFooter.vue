<template>
  <v-bottom-navigation v-model="value" color="primary">
    <v-btn value="Hr" @click="$router.push({ name: 'HR Dashboard' })">
      <v-icon>mdi-view-dashboard</v-icon>
      <span>HR</span>
    </v-btn>

    <v-btn value="Config" @click="$router.push({ name: 'HR Form' })">
      <v-icon>mdi-cog-outline</v-icon>

      <span>Configuration</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "AppFooter",
  data() {
    return {
      value: "",
    };
  },
  watch: {
    $route(to) {
      this.value = to.name === "HR Dashboard" ? "Hr" : "Config";
    },
  },
  mounted() {
    this.value = this.$route.name === "HR Dashboard" ? "Hr" : "Config";
  },
};
</script>

<style scoped></style>

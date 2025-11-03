<template>
  <v-tooltip location="top">
    <template v-slot:activator="{ props }">
      <router-link :to="href" v-if="href">
<<<<<<< HEAD
        <v-btn :color :class="{ styles: !!styles }" v-bind="props">{{
          text
        }}</v-btn>
      </router-link>
      <v-btn v-else :color :class v-bind="props">{{ text }}</v-btn>
=======
        <v-btn :color="color" :class="{ styles: !!styles }" v-bind="props">{{
          text
        }}</v-btn>
      </router-link>
      <v-btn v-else :color="color" v-bind="props">{{ text }}</v-btn>
>>>>>>> c777a2e80826355254db9cb30d77bb2471c7eb0d
    </template>
    <span>{{ TooltipText }}</span>
  </v-tooltip>
</template>
<script>
export default {
<<<<<<< HEAD
  name: "Btn",
=======
  name: "MyBtn",
>>>>>>> c777a2e80826355254db9cb30d77bb2471c7eb0d
  props: {
    text: {
      type: String,
      default: "Go to Dashboard",
    },
    href: {
      type: String,
      default: "/dashboard",
    },
    TooltipText: {
      type: String,
      default: "Navigate to Dashboard",
    },
    color: {
      type: String,
      default: "primary",
    },
    styles: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped></style>

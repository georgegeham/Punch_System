<template>
  <v-snackbar v-model="visible" :color="color" timeout="3000">
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="onClose(false)">Close</v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  name: "MySnackbar",
  computed: {
    visible: {
      get() {
        return this.$store.state.app.snackbarVisible;
      },
      set(value) {
        if (!value) this.$store.commit("app/hideSnackbar");
      },
    },
    text() {
      return this.$store.state.app.snackbarText;
    },
    color() {
      return this.$store.state.app.snackbarColor;
    },
  },
  methods: {
    onClose(value) {
      if (!value) {
        this.$store.commit("app/hideSnackbar");
      }
    },
  },
};
</script>
<style></style>

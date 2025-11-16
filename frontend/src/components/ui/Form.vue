<template>
  <v-card class="text-center rounded-md cardWidth" :loading="loading">
    <!-- Title Slot -->
    <v-card-title class="text-h5 justify-center">
      <slot name="title"></slot>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row no-gutters>
          <!-- Default Slot (buttons, forms, anything) -->
          <slot></slot>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "FormCard",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.cardWidth {
  width: 100%;
}
</style>

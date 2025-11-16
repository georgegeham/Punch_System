<template>
  <v-container fluid class="pb-0 mb-0">
    <v-card style="min-height: max-content" class="py-2">
      <!-- Loader -->
      <v-row v-if="loading" align="center" justify="center" no-gutters>
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="40"
            class="my-3"
          ></v-progress-circular>
          <div>Loading weather data...</div>
        </v-col>
      </v-row>

      <!-- Error -->
      <v-row v-else-if="error" align="center" justify="center" no-gutters>
        <v-col cols="12" class="text-center text-error">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          {{ error || "Failed to fetch weather data." }}
        </v-col>
      </v-row>

      <!-- Weather Info -->
      <v-row
        v-else-if="weather && weather.location"
        no-gutters
        class="d-flex justify-center align-center"
      >
        <v-col cols="12" sm="3" class="text-center">
          <v-card-title class="text-subtitle-1 justify-center">
            Weather Information
          </v-card-title>
        </v-col>

        <v-col cols="12" sm="4" class="d-flex align-center justify-center">
          <v-icon size="32" color="primary" class="mr-3">
            mdi-weather-partly-cloudy
          </v-icon>
          <div class="text-center">
            <h3 class="mb-1">{{ weather.temperature }}°C</h3>
            <p class="mb-0">{{ weather.condition }}</p>
          </div>
        </v-col>

        <v-col cols="12" sm="5">
          <v-list
            class="d-flex justify-center justify-md-space-between align-center"
          >
            <v-list-item
              class="d-flex flex-column flex-md-row justify-center align-center pt-8 pt-md-0"
            >
              <v-list-item-title>Location</v-list-item-title>
              <v-list-item-subtitle>{{
                weather.location
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item
              class="d-flex flex-column flex-md-row justify-center align-center pt-8 pt-md-0"
            >
              <v-list-item-title>Humidity</v-list-item-title>
              <v-list-item-subtitle
                >{{ weather.humidity }}%</v-list-item-subtitle
              >
            </v-list-item>

            <v-list-item
              class="d-flex flex-column flex-md-row justify-center align-center pt-8 pt-md-0"
            >
              <v-list-item-title>Wind</v-list-item-title>
              <v-list-item-subtitle
                >{{ weather.windSpeed }} km/h</v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <!-- Empty -->
      <v-row v-else align="center" justify="center" no-gutters>
        <v-col cols="12" class="text-center">
          <v-card-title class="text-subtitle-1 justify-center">
            Weather Information Not Available, Please Config your WorkPlace
            First
          </v-card-title>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "MyWeather",
  computed: {
    weather() {
      return this.$store.state.business.weather;
    },
    loading() {
      return this.$store.state.business.loading;
    },
    error() {
      return this.$store.state.business.error;
    },
  },
};
</script>

<style scoped>
.v-card {
  min-height: 150px;
}
</style>

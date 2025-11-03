<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center pa-0"
  >
    <v-row no-gutters class="fill-height pa-4" align="center" justify="center">
      <v-col cols="12">
        <v-card class="pb-2 fill-height" rounded="5">
          <v-card-title class="text-center ma-0 pa-0">
            <v-responsive :aspect-ratio="16 / 9" height="300">
              <v-img
                :src="require('@/assets/start.webp')"
                alt="Smart Punching System"
                cover
              />
            </v-responsive>
            <h2 class="mt-4 mx-auto">Smart Punching System</h2>
          </v-card-title>
          <v-card-text class="text-center">
            <p class="my-6">
              A comprehensive location-based attendance management system for
              employees and HR.
            </p>

            <v-row class="mt-4">
              <v-col
                v-for="feature in features"
                :key="feature.title"
                cols="12"
                md="3"
              >
                <v-card flat class="pa-4 fill-height">
                  <v-card-title class="d-flex flex-column align-center">
                    <v-icon
                      size="40"
                      :color="feature.color"
                      class="mb-3 d-block"
                    >
                      {{ feature.icon }}
                    </v-icon>
                    <h4 class="mb-2">{{ feature.title }}</h4>
                  </v-card-title>
                  <v-card-text>
                    <p class="text-body-2">
                      {{ feature.description }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="primary"
              ><router-link
                :to="{ name: 'Login' }"
                style="color: white; text-decoration: none"
                >Get Started</router-link
              ></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "MyStart",
  data() {
    return {
      features: [
        {
          icon: "mdi-map-marker-check",
          color: "primary",
          title: "Location-Based Punch",
          description:
            "Employees can punch in/out only when within the designated workplace zone using GPS verification.",
        },
        {
          icon: "mdi-clock-check-outline",
          color: "success",
          title: "Real-Time Tracking",
          description:
            "Track employee attendance in real-time with accurate timestamps and location data.",
        },
        {
          icon: "mdi-map-marker-radius",
          color: "warning",
          title: "Zone Management",
          description:
            "HR can define and manage workplace zones with customizable radius and boundaries.",
        },
        {
          icon: "mdi-chart-box-outline",
          color: "info",
          title: "HR Dashboard",
          description:
            "Complete overview of employee attendance records with detailed reports and analytics.",
        },
      ],
    };
  },
};
</script>
<style scoped></style>

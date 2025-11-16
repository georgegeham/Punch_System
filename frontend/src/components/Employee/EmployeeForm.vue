<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height" no-gutters>
      <v-col lg="5" sm="12">
        <FormCard :loading="loading">
          <template #title>Employee Punch Form</template>
          <ValidationObserver v-slot="{ invalid, handleSubmit }" ref="observer">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider
                      name="Employee Name"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="name"
                        label="Employee Name"
                        :error-messages="errors"
                        autofocus
                        prepend-icon="mdi-account"
                        readonly
                      />
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12">
                    <ValidationProvider name="Employee ID">
                      <v-text-field
                        v-model="employeeId"
                        label="Employee ID"
                        prepend-icon="mdi-badge-account"
                        readonly
                      />
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12">
                    <ValidationProvider
                      name="Location"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="location"
                        label="Current Location"
                        readonly
                        prepend-icon="mdi-crosshairs-gps"
                        :error-messages="errors"
                        @click:prepend="captureLocation"
                        hint="Click the GPS icon to capture your current location"
                        persistent-hint
                      />
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12">
                    <v-radio-group v-model="actionType" row>
                      <v-radio label="Punch In" value="punchIn" />
                      <v-radio label="Punch Out" value="punchOut" />
                    </v-radio-group>
                  </v-col>

                  <v-col cols="12" v-if="distance !== null">
                    <v-alert type="info" dense text>
                      <strong>Distance from workplace:</strong>
                      {{ distance.toFixed(2) }} meters
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      type="submit"
                      :loading="loading"
                      :disabled="invalid"
                      class="btn btn-primary btn-lg"
                    >
                      {{ actionType === "punchIn" ? "Punch In" : "Punch Out" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </form>
          </ValidationObserver>
        </FormCard>
      </v-col>
      <v-spacer class="d-none d-lg-block"></v-spacer>
      <v-col lg="6" sm="12" class="mt-4 mt-md-0">
        <v-card outlined class="fill-height" :loading="loading">
          <v-card-title class="pt-4">Employee Information</v-card-title>
          <v-divider class="my-4" />
          <v-list lines="two">
            <v-list-item v-if="name">
              <v-list-item-icon>
                <v-icon color="primary">mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Name</v-list-item-title>
                <v-list-item-subtitle>{{ name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="employeeId">
              <v-list-item-icon>
                <v-icon color="success">mdi-badge-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Employee ID</v-list-item-title>
                <v-list-item-subtitle>{{ employeeId }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="location">
              <v-list-item-icon>
                <v-icon color="warning">mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <MyMap :location="location" height="20vh" />
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="actionType">
              <v-list-item-icon>
                <v-icon :color="actionType === 'punchIn' ? 'green' : 'red'">
                  {{ actionType === "punchIn" ? "mdi-login" : "mdi-logout" }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Action</v-list-item-title>
                <v-list-item-subtitle>
                  {{ actionType === "punchIn" ? "Punch In" : "Punch Out" }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="currentTime">
              <v-list-item-icon>
                <v-icon color="info">mdi-clock-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Time</v-list-item-title>
                <v-list-item-subtitle>{{ currentTime }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MyMap from "../ui/Map.vue";
import { getLocation, getCurrentTime } from "../utils/util";
import FormCard from "../ui/Form.vue";

export default {
  components: { MyMap, FormCard },
  data() {
    return {
      name: "",
      employeeId: "",
      location: "",
      actionType: "punchIn",
      latitude: null,
      loading: false,
      longitude: null,
      distance: null,
      currentTime: "",
      isDataLoaded: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    storeLoading() {
      return this.$store.state.user.loading;
    },
    userLoading() {
      return this.$store.state.user.loading;
    },
  },
  created() {
    this.setUserData();
  },
  watch: {
    user: {
      handler() {
        if (!this.user.name)
          this.$router.push({ name: "Login", query: { userType: "Employee" } });
        else this.setUserData();
      },
      immediate: true,
    },
    storeLoading(newVal) {
      if (!newVal) {
        this.setUserData();
      }
    },
  },
  methods: {
    async captureLocation() {
      try {
        this.loading = true;
        const result = await getLocation(this.$store);
        const latitude = result.latitude;
        const longitude = result.longitude;
        this.location = result.location;
        const businessSettings = this.$store.state.user.user.company;
        const workplaceLat = businessSettings?.location.split(", ")[0];
        const workplaceLong = businessSettings?.location.split(", ")[1];
        if (workplaceLat && workplaceLong) {
          const employeeLatLng = window.L.latLng(latitude, longitude);
          const workplaceLatLng = window.L.latLng(workplaceLat, workplaceLong);

          this.distance = employeeLatLng.distanceTo(workplaceLatLng);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async onSubmit() {
      this.loading = true;
      this.currentTime = getCurrentTime();

      const data = {
        location: this.location,
        distance: this.distance,
        time: getCurrentTime(),
        punch_type: this.actionType,
      };
      await this.$store.dispatch("employee/punch", data);
      this.resetForm();
      this.loading = false;
    },
    resetForm() {
      this.location = "";
      this.distance = null;
      this.currentTime = "";
      this.actionType = "punchIn";
      this.$refs.observer?.reset();
    },
    setUserData() {
      if (this.user && this.user.name && this.user.id) {
        this.isDataLoaded = true;
        this.name = this.user.name;
        this.employeeId = this.user.id;
      } else {
        this.isDataLoaded = false;
      }
    },
  },
};
</script>

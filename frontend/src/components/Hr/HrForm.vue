<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col cols="6">
        <ValidationObserver v-slot="{ invalid, handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <v-container class="mr-auto fill-height">
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    name="Company Name"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="companyName"
                      :error-messages="errors"
                      label="Company Name"
                      required
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
                      :error-messages="errors"
                      label="Workplace Location"
                      required
                      readonly
                      prepend-icon="mdi-crosshairs-gps"
                      @click:prepend="captureLocation"
                      hint="Click the GPS icon to capture your current location"
                      persistent-hint
                    />
                  </ValidationProvider>
                </v-col>

                <v-col cols="12">
                  <ValidationProvider
                    name="Area"
                    rules="required|min_value:1"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="area"
                      :error-messages="errors"
                      label="Area (in meters square)"
                      required
                      type="string"
                      suffix="m2"
                    />
                  </ValidationProvider>
                </v-col>

                <v-col cols="12">
                  <v-switch
                    v-model="requireFixedHours"
                    label="Require fixed working hours"
                    color="primary"
                  />
                </v-col>

                <v-col cols="12" v-if="requireFixedHours">
                  <v-row>
                    <v-col cols="6">
                      <ValidationProvider
                        name="Start Hour"
                        :rules="requireFixedHours ? 'required' : ''"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="startHour"
                          :error-messages="errors"
                          label="Start Hour"
                          type="time"
                          required
                        />
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="6">
                      <ValidationProvider
                        name="End Hour"
                        :rules="
                          requireFixedHours
                            ? `required|${
                                startHour ? `after:${startHour}` : ''
                              }`
                            : ''
                        "
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="endHour"
                          :error-messages="errors"
                          label="End Hour"
                          type="time"
                          required
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    :disabled="invalid || loading"
                    color="info"
                    :loading="loading"
                    class="mr-4"
                    type="submit"
                  >
                    Save Workplace Settings
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </form>
        </ValidationObserver>
      </v-col>

      <v-col cols="6">
        <v-card outlined class="fill-height" :loading="loading">
          <v-card-title class="pt-4">Current Settings</v-card-title>
          <v-card-text>
            <v-divider class="my-4"></v-divider>
            <v-list lines="two">
              <v-list-item v-if="companyName">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-domain</v-icon>
                </template>
                <v-list-item-title>Company Name</v-list-item-title>
                <v-list-item-subtitle>{{ companyName }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="location" class="ms-4">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-map-marker</v-icon>
                </template>
                <MyMap
                  :location="location"
                  :area="area ? area : null"
                  height="20vh"
                />
              </v-list-item>

              <v-list-item v-if="area">
                <template v-slot:prepend>
                  <v-icon color="success">mdi-map-marker-radius</v-icon>
                </template>
                <v-list-item-title>Area</v-list-item-title>
                <v-list-item-subtitle
                  >{{ area }} meters square</v-list-item-subtitle
                >
              </v-list-item>

              <v-list-item v-if="requireFixedHours">
                <template v-slot:prepend>
                  <v-icon color="warning">mdi-clock-outline</v-icon>
                </template>
                <v-list-item-title>Working Hours</v-list-item-title>
                <v-list-item-subtitle>
                  {{ startHour || "--:--" }} to {{ endHour || "--:--" }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Company from "@/store/slices/Classes/Company";
import MyMap from "../ui/Map.vue";
import { getLocation } from "../utils/util";
export default {
  name: "HrForm",
  components: {
    MyMap,
  },
  data() {
    return {
      companyName: "",
      location: "",
      area: "",
      requireFixedHours: false,
      startHour: "",
      endHour: "",
      loading: false,
    };
  },
  methods: {
    async captureLocation() {
      try {
        this.loading = true;
        const position = await getLocation(this.$store);
        this.location = position.location;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async onSubmit() {
      try {
        this.loading = true;
        const data = {
          name: this.companyName,
          location: this.location,
          area: this.area,
          requires_hours: this.requireFixedHours,
          start_time: this.requireFixedHours ? this.startHour : null,
          end_time: this.requireFixedHours ? this.endHour : null,
        };
        const company = new Company();
        const response = await company.create(data);
        this.$store.dispatch("setBusinessSettings", response);
        this.$store.commit("showSnackbar", {
          text: response.message,
          color: "success",
        });
        this.$router.push({ name: "HR Dashboard" });
        // this.$store.commit("setSelectedCompany", response.companies);
      } catch (error) {
        this.$store.commit("showSnackbar", {
          text:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          color: "error",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>

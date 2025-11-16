<template>
  <v-container fluid>
    <v-row no-gutters class="first">
      <v-col cols="12">
        <MyMap
          height="30vh"
          :worker="employee"
          :location="BusinessSettings?.location"
          :radius="BusinessSettings?.radius"
          :area="BusinessSettings?.area"
        />
      </v-col>
    </v-row>
    <v-row no-gutters class="hcal">
      <v-col cols="12">
        <EmployeeRecords @pinlocation="handlePinLocation" :punches="Records" />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" class="pa-0">
        <MyWeather />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import EmployeeRecords from "../Employee/EmployeeRecords.vue";
import MyMap from "../ui/Map.vue";
import MyWeather from "../weather/Weather.vue";

export default {
  name: "HrDashboard",
  computed: {
    BusinessSettings() {
      return this.$store.state.business.BusinessSettings;
    },
    Records() {
      return this.$store.state.business.records;
    },
    BusinessLoading() {
      return this.$store.state.business.loading;
    },
    EmployeeLoading() {
      return this.$store.state.employee.loading;
    },
  },
  data: () => ({
    employee: null,
    companyDone: false,
  }),
  components: {
    MyWeather,
    MyMap,
    EmployeeRecords,
  },
  created() {
    this.getCompany();
  },
  mounted() {
    if (this.BusinessSettings.id) this.broadcast();
  },
  watch: {
    BusinessSettings() {
      if (this.BusinessSettings.id) this.broadcast();
    },
  },
  methods: {
    handlePinLocation(employee) {
      console.log(employee);
      this.employee = employee;
    },
    async getCompany() {
      try {
        await this.$store.dispatch("business/setBusinessSettings");
        if (this.BusinessSettings.companyName) {
          return;
        } else {
          if (this.BusinessLoading) return;
          this.$router.push({ name: "HR Form" });
          this.$store.commit("app/showSnackbar", {
            text: "Please register your company",
            color: "info",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    broadcast() {
      this.$echo
        .private(`company-${this.BusinessSettings.id}`)
        .listen("PunchEvent", (e) => {
          console.log("Received Punch Event:", e);
          this.$store.dispatch("business/addRecord", e.punch);
        });
    },
  },
  beforeDestroy() {
    this.$echo.leave(`company-${this.BusinessSettings.id}`);
  },
};
</script>
<style scoped>
.first {
  transform: translateY(-20px);
}
</style>

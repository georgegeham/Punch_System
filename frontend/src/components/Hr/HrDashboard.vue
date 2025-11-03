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
        <EmployeeRecords @pinlocation="handlePinLocation" :punches="punches" />
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
import Company from "@/store/slices/Classes/Company";
import EmployeeRecords from "../Employee/EmployeeRecords.vue";
import MyMap from "../ui/Map.vue";
import MyWeather from "../weather/Weather.vue";
import HR from "@/store/slices/Classes/HR";

export default {
  name: "HrDashboard",
  computed: {
    BusinessSettings() {
      return this.$store.getters.BusinessSettings;
    },
    Employees() {
      return this.$store.getters.Employees;
    },
  },
  data: () => ({
    employee: null,
    punches: [],
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
  watch: {
    companyDone() {
      if (this.companyDone) {
        this.getRecords();
      }
    },
  },
  methods: {
    handlePinLocation(employee) {
      console.log(employee);
      this.employee = employee;
    },
    async getCompany() {
      const company = new Company();
      try {
        const response = await company.getAll();
        if (response.companies) {
          this.$store.dispatch("setBusinessSettings", response.companies);
          this.success(response);
          this.companyDone = true;
          // this.$store.commit("setSelectedCompany", response.companies[0]);
        } else {
          this.$router.push({ name: "HR Form" });
          this.$store.commit("showSnackbar", {
            text: "Please register your company",
            color: "info",
          });
        }
      } catch (error) {
        console.log(error);
        this.failed(error);
      }
    },
    async getRecords() {
      try {
        const hr = new HR();
        const response = await hr.getPunches();
        this.punches = response.data;
        this.success(response);
        return response.punches;
      } catch (error) {
        console.log(error);
        this.failed(error);
      }
    },
    success(res) {
      this.$store.commit("showSnackbar", {
        text: res.message || "Action is successful!",
        color: "success",
      });
    },
    failed(err) {
      this.$store.commit("showSnackbar", {
        text: err.response?.data?.message || err.message || "An error occurred",
        color: "error",
      });
    },
  },
};
</script>
<style scoped>
.first {
  transform: translateY(-20px);
}
.hcal {
  height: calc(50vh);
}
</style>

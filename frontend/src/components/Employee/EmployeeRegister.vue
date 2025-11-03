<template>
  <v-container fluid class="d-flex fill-height justify-center">
    <v-card class="text-center rounded-md cardWidth" :loading="loading">
      <v-card-title class="text-h4 pt-4 justify-center">
        Register Page
      </v-card-title>
      <v-card-text>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(registerEmployee)">
            <ValidationProvider
              name="Name"
              rules="required|min:3"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="form.name"
                label="Name"
                placeholder="Enter your Name"
                :error-messages="errors"
                class="mb-4"
              ></v-text-field>
            </ValidationProvider>

            <ValidationProvider name="Email" rules="required|email">
              <v-text-field
                v-model="form.email"
                label="Email"
                class="mb-4"
                filled
                readonly
              ></v-text-field>
            </ValidationProvider>

            <ValidationProvider
              name="Password"
              rules="required|min:6"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                placeholder="Enter your Password"
                :error-messages="errors"
                class="mb-4"
              ></v-text-field>
            </ValidationProvider>

            <ValidationProvider
              name="Password Confirmation"
              :rules="`required|min:6|equal:${form.password}`"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="form.password_confirmation"
                label="Password Confirmation"
                type="password"
                placeholder="Confirm your Password"
                :error-messages="errors"
                class="mb-4"
              ></v-text-field>
            </ValidationProvider>
            <v-btn
              color="primary"
              class="mt-2"
              :loading="loading"
              type="submit"
            >
              Register
            </v-btn>

            <div class="mt-4">
              Already have an account?
              <router-link
                :to="{ name: 'Login', query: { userType: 'Employee' } }"
                >Login here</router-link
              >
            </div>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Employee from "@/store/slices/Classes/Employee";
export default {
  name: "EmployeeRegister",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      companyId: null,
      valid: false,
      token: null,
      loading: false,
    };
  },

  mounted() {
    // GeURL
    this.token = this.$route.query.token;
    this.validateToken();
  },
  methods: {
    async validateToken() {
      if (!this.token) {
        this.$router.push({ name: "Login", query: { userType: "Employee" } });
        return;
      }
      try {
        const employee = new Employee();
        const res = await employee.verifyInvite(this.token);
        this.$store.commit("showSnackbar", {
          text: res.message || "Token verified successfully",
          color: "success",
        });
        this.form.email = res.data.email;
        this.companyId = res.data.companyId;
        this.valid = true;
      } catch (err) {
        this.$store.commit("showSnackbar", {
          text:
            err.response?.data?.message || err.message || "An error occurred",
          color: "error",
        });
        console.log("err", err);
      }
    },
    async registerEmployee() {
      this.loading = true;
      if (!this.valid) {
        this.failed(),
          this.$router.push({ name: "Login", query: { userType: "Employee" } });
        return;
      }
      try {
        const employee = new Employee();
        const res = await employee.register({
          token: this.token,
          name: this.form.name,
          password: this.form.password,
          password_confirmation: this.form.password_confirmation,
        });
        this.success(res);
      } catch (err) {
        console.error(err);
        this.failed(err);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.name = "";
      this.email = "";
      this.password = "";
      this.$refs.observer?.reset();
    },
    success(res) {
      this.$store.commit("showSnackbar", {
        text: res.message || "Registration successful!",
        color: "success",
      });
      this.$router.push({ name: "Login", query: { userType: "Employee" } });
    },
    failed(res) {
      this.$store.commit("showSnackbar", {
        text: res.response?.data?.message || res.message || "An error occurred",
        color: "error",
      });
    },
  },
};
</script>

<style scoped>
.cardWidth {
  width: 500px;
}
</style>

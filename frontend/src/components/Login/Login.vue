<template>
  <v-container fluid class="d-flex fill-height justify-center">
    <v-card class="text-center rounded-md cardWidth" :loading="loading">
      <v-card-title class="text-h4 justify-center mt-4"
        >Login Page</v-card-title
      >
      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-btn
                :color="userType === 'HR' ? '' : 'primary'"
                :class="[{ activeBtn: userType === 'HR' }, 'ma-2 w-66']"
                @click="userType = 'HR'"
              >
                <v-icon left>mdi-cog-outline</v-icon>
                HR
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn
                :color="userType === 'Employee' ? '' : 'primary'"
                :class="[
                  'ma-2 w-66 w-md-75',
                  { activeBtn: userType === 'Employee' },
                ]"
                @click="userType = 'Employee'"
              >
                <v-icon left>mdi-account-outline</v-icon>
                Employee
              </v-btn>
            </v-col>

            <v-col cols="12" class="mt-4">
              <ValidationObserver v-slot="{ invalid, handleSubmit }">
                <v-form @submit.prevent="handleSubmit(onSubmit)">
                  <ValidationProvider
                    name="email"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="form.email"
                      label="Email"
                      placeholder="Enter your email"
                      :error-messages="errors"
                      class="mb-4"
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
                  <router-link
                    :to="{ name: 'Register' }"
                    class="d-block text-right mb-3"
                    >Don't have an account?</router-link
                  >
                  <v-btn
                    color="primary"
                    class="mt-2"
                    :disabled="invalid || loading"
                    :loading="loading"
                    type="submit"
                  >
                    Login as {{ userType }}
                  </v-btn>
                </v-form>
              </ValidationObserver>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import User from "@/store/slices/Classes/User";

export default {
  name: "MyLogin",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      userType: "HR",
      loading: false,
    };
  },
  mounted() {
    this.userType = this.getQueryParams() || "HR";
  },
  methods: {
    getQueryParams() {
      return this.$route.query?.userType;
    },
    async onSubmit() {
      this.loading = true;
      try {
        const user = new User();
        const response = await user.login(this.form);
        this.$store.commit("showSnackbar", {
          text: response?.message,
          color: "success",
        });
        const userData = {
          ...response.user,
          token: response.token,
        };
        if (response.company) userData.company = response.company;
        this.$store.dispatch("setUser", userData);

        if (this.userType === "HR") this.$router.push({ name: "HR Dashboard" });
        else this.$router.push({ name: "Employee Form" });
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

<style scoped>
.v-btn {
  transition: all 0.3s ease;
}

.activeBtn {
  background-color: #d2b619 !important;
  color: white !important;
}

.cardWidth {
  width: 500px;
}
</style>

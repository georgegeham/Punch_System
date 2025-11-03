<template>
  <v-container fluid class="d-flex fill-height justify-center">
    <v-card class="pa-4 text-center rounded-md cardWidth">
      <v-card-title class="text-h4 justify-center">
        Register Page
      </v-card-title>
      <v-card-text>
        <span class="d-block text-subtitle-1">Register for HR only</span>
        <ValidationObserver v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
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

            <ValidationProvider
              name="Email"
              rules="required|email"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="form.email"
                label="Email"
                placeholder="Enter your Email"
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
              <router-link :to="{ name: 'Login' }">Login here</router-link>
            </div>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import HR from "@/store/slices/Classes/HR";

export default {
  name: "RegisterPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      try {
        const data = { ...this.form, role: "hr" };
        const hr = new HR();
        const response = await hr.create(data);

        this.$store.commit("showSnackbar", {
          text: response.message,
          color: "success",
        });

        this.$router.push({ name: "Login" });
      } catch (error) {
        this.$store.commit("showSnackbar", {
          text:
            error.response.data.message || error.message || "An error occurred",
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
.cardWidth {
  width: 500px;
}
</style>

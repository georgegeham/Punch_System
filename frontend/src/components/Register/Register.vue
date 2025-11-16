<template>
  <v-container fluid class="d-flex fill-height justify-center">
    <FormCard :loading="loading">
      <template #title>Register Page </template>

      <span class="d-flex text-center mx-auto text-subtitle-1"
        >Register for HR only</span
      >
      <v-col cols="12" class="mt-4">
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
                autofocus
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
              class="btn btn-primary btn-lg"
              :loading="loading"
              type="submit"
            >
              Register
            </v-btn>

            <div class="mt-4">
              Already have an account?
              <router-link
                :to="{ name: 'Login' }"
                class="btn btn-llink btn-sm pl-0"
                >Login here</router-link
              >
            </div>
          </v-form>
        </ValidationObserver>
      </v-col>
    </FormCard>
  </v-container>
</template>

<script>
import FormCard from "@/components/ui/Form.vue";
export default {
  name: "RegisterPage",
  components: { FormCard },
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  computed: {
    loading() {
      return this.$store.state.user.loading;
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch("user/registerHr", this.form);
        this.$router.push({ name: "Login" });
      } catch (error) {
        this.$store.commit("showSnackbar", {
          text:
            error.response.data.message || error.message || "An error occurred",
          color: "error",
        });
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

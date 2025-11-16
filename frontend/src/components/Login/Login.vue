<template>
  <v-container fluid class="d-flex fill-height justify-center">
    <FormCard :loading="loading">
      <template #title>Login Page</template>
      <v-col cols="12" sm="6">
        <v-btn
          :class="[{ 'btn-active': userType === 'HR' }, 'btn btn-ghost btn-lg']"
          @click="userType = 'HR'"
        >
          <v-icon left>mdi-cog-outline</v-icon>
          HR
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn
          :class="[
            'btn btn-ghost btn-lg',
            { 'btn-active': userType === 'Employee' },
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
                autofocus
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
              class="d-block text-right btn btn-link btn-sm mb-2"
              >Don't have an account?</router-link
            >
            <v-btn
              class="btn btn-primary"
              :disabled="invalid || loading"
              :loading="loading"
              type="submit"
            >
              Login as {{ userType }}
            </v-btn>
          </v-form>
        </ValidationObserver>
      </v-col>
    </FormCard>
  </v-container>
</template>
<script>
import FormCard from "@/components/ui/Form.vue";
export default {
  name: "MyLogin",
  components: { FormCard },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      userType: "HR",
    };
  },
  mounted() {
    this.userType = this.getQueryParams() || "HR";
  },
  computed: {
    loading() {
      return this.$store.state.user.loading;
    },
  },
  methods: {
    getQueryParams() {
      return this.$route.query?.userType;
    },
    async onSubmit() {
      try {
        const data = { ...this.form, role: this.userType };
        const login = await this.$store.dispatch("user/setUser", data);
        if (!login) return;
        if (this.userType === "HR") this.$router.push({ name: "HR Dashboard" });
        else this.$router.push({ name: "Employee Form" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  transition: all 0.3s ease;
}

.cardWidth {
  width: 500px;
}
</style>

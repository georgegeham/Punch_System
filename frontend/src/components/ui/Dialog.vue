<template>
  <v-dialog
    :value="dialog"
    @input="$emit('update:dialog', $event)"
    max-width="500px"
    persistent
  >
    <v-card :loading="loading">
      <v-card-title>
        <span class="text-h5">Send Email to Employee</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <ValidationObserver ref="observer" v-slot="{ invalid, handleSubmit }">
        <form @submit.prevent="handleSubmit(sendEmail)">
          <v-card-text>
            <ValidationProvider
              v-slot="{ errors }"
              name="email"
              rules="required|email"
            >
              <v-text-field
                v-model="email"
                :error-messages="errors"
                label="Employee Email"
                type="email"
                outlined
                autofocus
                dense
                prepend-inner-icon="mdi-email"
                required
              ></v-text-field>
            </ValidationProvider>
          </v-card-text>

          <v-card-actions>
            <v-btn text @click="closeDialog"> Close </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="sendEmail"
              :disabled="loading || invalid"
              :loading="sending"
            >
              Send
            </v-btn>
          </v-card-actions>
        </form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EmployeeEmailDialog",
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      email: "",
      sending: false,
    };
  },
  computed: {
    loading() {
      return this.$store.state.user.loading;
    },
  },
  methods: {
    async sendEmail() {
      this.sending = true;
      try {
        // Your send email logic here
        await this.$store.dispatch("user/inviteUser", this.email);
        this.resetForm();
        this.closeDialog();
      } catch (error) {
        console.error("Error sending email:", error);
        // Handle error (show snackbar, etc.)
      } finally {
        this.sending = false;
      }
    },
    closeDialog() {
      this.resetForm();
      this.$emit("update:dialog", false);
    },
    resetForm() {
      this.email = "";
      this.$refs.observer?.reset();
    },
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>

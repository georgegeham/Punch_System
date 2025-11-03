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
              v-if="sent"
              outlined
              color="primary"
              @click="resendEmail"
              :disabled="loading"
              :loading="resending"
            >
              Resend Email
            </v-btn>
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
import Employee from "@/store/slices/Classes/Employee";

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
      sent: false,
      sending: false,
      resending: false,
    };
  },
  computed: {
    loading() {
      return this.sending || this.resending;
    },
  },
  methods: {
    async sendEmail() {
      this.sending = true;
      try {
        // Your send email logic here
        const response = await this.handleSendEmail();
        this.sent = true;
        this.resetForm();
        this.closeDialog();
        this.$store.commit("showSnackbar", {
          text: response.message || "Email sent successfully",
          color: "success",
        });
      } catch (error) {
        console.error("Error sending email:", error);
        this.$store.commit("showSnackbar", {
          text:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          color: "error",
        });
        // Handle error (show snackbar, etc.)
      } finally {
        this.sending = false;
      }
    },
    async resendEmail() {
      this.resending = true;
      try {
        // Your resend email logic here
        const response = await this.handleSendEmail();
        // this.$emit("email-resent", this.email);
        this.resetForm();
        this.closeDialog();
        this.$store.commit("showSnackbar", {
          text: response.message || "Email resent successfully",
          color: "success",
        });
      } catch (error) {
        console.error("Error resending email:", error);
        this.$store.commit("showSnackbar", {
          text:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          color: "error",
        });
        // Handle error (show snackbar, etc.)
      } finally {
        this.resending = false;
      }
    },
    async handleSendEmail() {
      const employee = new Employee();

      const response = await employee.invite(this.email);
      return response;
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

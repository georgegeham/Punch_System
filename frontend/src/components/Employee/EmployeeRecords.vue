<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="pa-0" align="start">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold">Employee Punch Records</h2>
      </v-col>
    </v-row>

    <v-row v-if="punches?.length === 0" class="fill-height">
      <v-col cols="12">
        <v-alert type="info" text>
          No punch records found. Employees will appear here after punching in
          or out.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else class="fill-height">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="punches"
          class="elevation-2 rounded-md"
          density="comfortable"
        >
          <!-- Punch Type -->
          <template v-slot:[`item.punch_type`]="{ item }">
            <v-chip
              :color="item.punch_type === 'punchIn' ? 'green' : 'yellow'"
              text-color="white"
              size="small"
              variant="flat"
            >
              {{ item.punch_type === "punchIn" ? "Punch In" : "Punch Out" }}
            </v-chip>
          </template>

          <!-- Valid / Zone -->
          <template v-slot:[`item.valid`]="{ item }">
            <v-chip
              :color="item.valid === 'inzone' ? 'success' : 'error'"
              text-color="white"
              size="small"
              variant="flat"
            >
              {{ item.valid === "inzone" ? "In Zone" : "Out of Zone" }}
            </v-chip>
          </template>

          <!-- Status -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="
                item.status === 'early' || item.status === 'on_time'
                  ? 'green'
                  : item.status === 'absent' ||
                    item.status === 'late' ||
                    item.status === 'early_leave'
                  ? 'error'
                  : 'yellow'
              "
              text-color="white"
              size="small"
              variant="flat"
            >
              {{ formatStatus(item.status) }}
            </v-chip>
          </template>

          <!-- Date -->
          <template v-slot:[`item.created_at`]="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "EmployeePunchTable",
  props: {
    punches: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: "Employee Name", value: "employee_name" },
      { text: "Email", value: "employee_email" },
      { text: "Punch Type", value: "punch_type" },
      { text: "Zone", value: "valid" },
      { text: "Status", value: "status" },
      // { title: "Distance (m)", value: "distance" },
      // { title: "Location", value: "location" },
      { text: "Date", value: "created_at" },
    ],
  }),
  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatStatus(status) {
      let formattedStatus = status;
      if (status.includes("_")) {
        formattedStatus = status.replace("_", " ");
      }
      return formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1);
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 12px;
  background-color: #fff;
}

.v-chip {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.text-h4 {
  color: #2b2b2b;
}

.v-alert {
  border-radius: 12px;
}
</style>

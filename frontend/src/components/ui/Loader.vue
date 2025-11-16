<template>
  <div
    class="loader-container"
    v-if="loading || businessLoading || employeeLoading || userLoading"
  >
    <svg viewBox="0 0 400 160" class="loader-svg">
      <!-- Define the text path -->
      <text x="35%" y="50%" dy=".32em" text-anchor="middle" class="text-body">
        Benefits
      </text>
      <text x="75%" y="50%" dy=".32em" text-anchor="middle" class="text-body">
        Hero
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: "FullScreenLoader",
  computed: {
    loading() {
      return this.$store.state.app.loading;
    },
    businessLoading() {
      return this.$store.state.business.loading;
    },
    employeeLoading() {
      return this.$store.state.employee.loading;
    },
    userLoading() {
      return this.$store.state.user.loading;
    },
  },
};
</script>

<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0rem;
  width: 100vw;
  height: 100vh;
  opacity: 0.98;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-svg {
  width: 30rem;
  display: flex;
  justify-content: center;
}

svg text {
  font-size: 48px;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  stroke: #ffffff;
  animation: 3s infinite alternate write;
}

@keyframes write {
  0% {
    fill: transparent;
    stroke: #ffffff;
    stroke-width: 2;
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 32%;
  }
  50% {
    fill: transparent;
    stroke: #ffffff;
    stroke-width: 2;
  }
  80%,
  100% {
    fill: #ffffff;
    stroke: transparent;
    stroke-width: 0;
    stroke-dashoffset: -25%;
    stroke-dasharray: 32% 0;
  }
}
</style>

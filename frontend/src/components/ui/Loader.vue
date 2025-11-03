<template>
  <div class="loader-container">
    <svg viewBox="0 0 400 160" class="loader-svg">
      <!-- Define the text path -->
      <text x="35%" y="50%" dy=".32em" text-anchor="middle" class="text-body">
        Benefits
      </text>
      <text x="75%" y="50%" dy=".32em" text-anchor="middle" class="text-body">
        Hero
      </text>
    </svg>
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: "FullScreenLoader",
};
</script>

<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0rem;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  fill: none;
  stroke: #ffffff;
  stroke-width: 2;
  stroke-dasharray: 1000;
  stroke-dashoffset: 250;
  animation: write 3s ease-in-out infinite;
}

@keyframes write {
  0% {
    stroke-dashoffset: 1000;
  }
  70% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 1000;
  }
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
